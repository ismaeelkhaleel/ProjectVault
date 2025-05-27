import express from "express";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import Comment from "../models/comment.model.js";
import Profile from "../models/profile.model.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import axios from "axios";
import multer from "multer";
import simpleGit from "simple-git";
import UserActivity from "../models/userActivity.model.js";
import { sendNotification } from "../utils/sendNotification.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.body.userId;

    if (!userId) {
      return cb(new Error("User ID is required for file upload"), null);
    }

    const userDir = path.join(__dirname, "../uploads", userId);

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    cb(null, userDir);
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const videoTypes = [
    "video/mp4",
    "video/mkv",
    "video/webm",
    "video/avi",
    "video/mov",
  ];
  const documentTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (
    file.fieldname === "demoVideoPath" &&
    videoTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else if (
    file.fieldname === "desertationPath" &&
    documentTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only videos and documents are allowed"),
      false
    );
  }
};

const upload = multer({ storage, fileFilter });

export const uploadProject = async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      githubRepo,
      category,
      technology,
      year,
    } = req.body;
    const demoVideoPath = req.files?.demoVideoPath?.[0]?.path || null;
    const desertationPath = req.files?.desertationPath?.[0]?.path || null;

    if (!userId)
      return res.status(400).json({ message: "User ID is required" });
    if (!githubRepo)
      return res.status(400).json({ message: "GitHub repository is required" });
    if (!demoVideoPath)
      return res.status(400).json({ message: "Demo video is required" });
    if (!desertationPath)
      return res.status(400).json({ message: "Dissertation file is required" });

    const existingUser = await User.findById(userId);
    if (!existingUser)
      return res.status(400).json({ message: "User not found" });

    const profile = await Profile.findOne({ user: userId });
    if (!profile.verified) {
      return res.status(400).json({ message: "User is not verified" });
    }

    const repoName = githubRepo.split("/").slice(-2).join("-");
    const uploadsDir = path.join(__dirname, "../uploads", userId);
    const clonePath = path.join(uploadsDir, repoName);
    const zipPath = path.join(uploadsDir, `${repoName}.zip`);

    if (!fs.existsSync(uploadsDir))
      fs.mkdirSync(uploadsDir, { recursive: true });

    const repoZipUrl = `${githubRepo.replace(
      ".git",
      ""
    )}/archive/refs/heads/main.zip`;
    console.log(`Downloading ZIP from: ${repoZipUrl}`);

    const response = await axios({
      method: "GET",
      url: repoZipUrl,
      responseType: "stream",
    });

    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(zipPath);
      response.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log(`ZIP file saved at: ${zipPath}`);
    console.log(`Cloning repository using simple-git into: ${clonePath}`);

    const git = simpleGit();

    if (fs.existsSync(clonePath)) {
      fs.rmSync(clonePath, { recursive: true, force: true });
    }

    await git.clone(githubRepo, clonePath.replace(/\\/g, "/"));
    console.log("Repository cloned successfully!");

    const baseUploadsPath = path.join(__dirname, "../uploads");

    const makePublicUrl = (filePath) => {
      const relativePath = path.relative(baseUploadsPath, filePath);
      return `http://localhost:5000/uploads/${relativePath.replaceAll(
        "\\",
        "/"
      )}`;
    };

    const publicVideoUrl = makePublicUrl(demoVideoPath);
    const publicZipUrl = makePublicUrl(zipPath);
    const publicClonePath = makePublicUrl(clonePath);
    const publicDesertationUrl = makePublicUrl(desertationPath);

    const project = new Project({
      userId,
      title,
      description,
      year,
      githubRepo,
      category,
      technology,
      clonedPath: publicClonePath,
      zipFilePath: publicZipUrl,
      demoVideoPath: publicVideoUrl,
      desertationPath: publicDesertationUrl,
    });

    await project.save();
    console.log("Project details saved successfully!");

    await UserActivity.create({
      userId: userId,
      activityType: "project_submission",
      activityDate: new Date(),
    });

    res.status(201).json({
      message: "GitHub repository cloned and ZIP file downloaded successfully",
      project,
    });
  } catch (error) {
    console.error("Error in uploadProject:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export { upload };

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("userId", "name username email profilePicture")
      .sort({ likes: -1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId).populate(
      "userId",
      "name username"
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserProjects = async (req, res) => {
  try {
    const userId = req.params.id;
    const projects = await Project.find({ userId }).populate(
      "userId",
      "name username email profilePictur"
    );
    res.json(projects);
  } catch (error) {
    console.error("Error fetching user projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const saveProject = async (req, res) => {
  const { id: projectId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.saveProjects.includes(projectId)) {
      return res.status(400).json({ message: "Project already saved" });
    }

    user.saveProjects.push(projectId);
    await user.save();

    await UserActivity.create({
      userId: user._id,
      activityType: "project_save",
      activityDate: new Date(),
    });

    res.status(200).json({
      message: "Project saved successfully",
      saveProjects: user.saveProjects,
    });
  } catch (error) {
    console.error("Error saving project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const unSaveProject = async (req, res) => {
  const { id: projectId } = req.params;
  const { userId } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.saveProjects.includes(projectId)) {
      return res.status(400).json({ message: "Project not saved" });
    }
    user.saveProjects = user.saveProjects.filter(
      (id) => id.toString() !== projectId
    );
    await user.save();
    res.status(200).json({ message: "Project un-saved successfully" });
  } catch (error) {
    console.error("Error un saving project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSavedProjects = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("saveProjects");
    res.json(user.saveProjects);
  } catch (error) {
    console.error("Error fetching saved projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const incrementLikes = async (req, res) => {
  const { id: projectId } = req.params;
  const { userId } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    project.likes += 1;
    await project.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.likeProjects.includes(projectId)) {
      return res.status(400).json({ message: "Project already liked" });
    }
    user.likeProjects.push(projectId);
    await user.save();
    project.likeBy.push(userId);
    await project.save();
    await UserActivity.create({
      userId: user._id,
      activityType: "like",
      activityDate: new Date(),
    });
    await sendNotification({
      recipientId: project.userId.toString(),
      senderId: userId,
      type: "like_project",
      projectId,
    });
    res.status(200).json({ message: "Likes incremented successfully" });
  } catch (error) {
    console.error("Error incrementing likes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deccrementLikes = async (req, res) => {
  const { id: projectId } = req.params;
  const { userId } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    project.likes -= 1;
    await project.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.likeProjects.includes(projectId)) {
      return res.status(400).json({ message: "Project not liked" });
    }
    user.likeProjects = user.likeProjects.filter(
      (id) => id.toString() !== projectId
    );
    await user.save();
    project.likeBy.pull(userId);
    await project.save();
    res.status(200).json({ message: "Likes decremented successfully" });
  } catch (error) {
    console.error("Error deccrementing likes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLikedProjects = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("likeProjects");
    res.json(user.likeProjects);
  } catch (error) {
    console.error("Error fetching Liked projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCommentedProjects = async (req, res) => {
  try {
    const userId = req.params.id;

    const userComments = await Comment.find({ userId }).select("projectId");

    const projectIds = [
      ...new Set(userComments.map((c) => c.projectId.toString())),
    ];

    const projects = await Project.find({ _id: { $in: projectIds } });

    res.json(projects);
  } catch (error) {
    console.error("Error fetching commented projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const incrementViews = async (req, res) => {
  const { id: projectId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    project.views += 1;
    await project.save();
  } catch (error) {
    console.error("Error incrementing views:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCodeTree = async (req, res) => {
  const projectId = req.params.id;

  try {
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const codePath = project.clonedPath;

    if (!codePath) {
      return res
        .status(404)
        .json({ error: "Code path not found for the project" });
    }

    const uploadsFolderPath = path.join(__dirname, "..", "uploads");
    const relativePath = codePath.replace(
      /^http:\/\/localhost:5000\/uploads\//,
      ""
    );
    const absoluteLocalPath = path.join(uploadsFolderPath, relativePath);

    const getDirectoryStructure = (dirPath) => {
      const result = {
        name: path.basename(dirPath),
        type: "folder",
        children: [],
      };
      const files = fs.readdirSync(dirPath);

      files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) {
          result.children.push(getDirectoryStructure(filePath));
        } else {
          result.children.push({ name: file, type: "file", path: filePath });
        }
      });

      return result;
    };

    const directoryStructure = getDirectoryStructure(absoluteLocalPath);

    res.json(directoryStructure);
  } catch (error) {
    console.error("Error fetching project or directory structure:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFileContent = (req, res) => {
  const { filePath } = req.query;

  if (!filePath) {
    return res.status(400).json({ error: "File path is required" });
  }

  const absoluteFilePath = path.join(__dirname, "..", filePath);

  if (!fs.existsSync(absoluteFilePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  try {
    const content = fs.readFileSync(absoluteFilePath, "utf-8");
    res.json({ content });
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
