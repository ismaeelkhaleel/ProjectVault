import express from "express";
import { exec } from "child_process";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import axios from "axios";
import multer from "multer";

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
  const allowedTypes = [
    "video/mp4",
    "video/mkv",
    "video/webm",
    "video/avi",
    "video/mov",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only videos are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

export const uploadProject = async (req, res) => {
  try {
    const { userId, title, description, githubRepo } = req.body;
    const demoVideoPath = req.file ? req.file.path : null;

    if (!userId)
      return res.status(400).json({ message: "User ID is required" });
    if (!githubRepo)
      return res.status(400).json({ message: "GitHub repository is required" });

    if (!demoVideoPath)
      return res.status(400).json({ message: "Demo video is required" });
    const existingUser = await User.findById(userId);
    if (!existingUser)
      return res.status(400).json({ message: "User not found" });

    const existingProject = await Project.findOne({ userId, title });
    if (existingProject)
      return res.status(400).json({ message: "Project already exists" });

    const repoName = githubRepo.split("/").slice(-2).join("-");
    const userDir = path.join(__dirname, "../uploads", userId);
    const clonePath = path.join(userDir, repoName);
    const zipPath = path.join(userDir, `${repoName}.zip`);

    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

    const repoZipUrl = `${githubRepo.replace(
      ".git",
      ""
    )}/archive/refs/heads/main.zip`;

    console.log(`📥 Downloading ZIP from: ${repoZipUrl}`);

    const response = await axios({
      method: "GET",
      url: repoZipUrl,
      responseType: "stream",
    });

    const writer = fs.createWriteStream(zipPath);
    response.data.pipe(writer);

    writer.on("finish", async () => {
      console.log(`ZIP file saved at: ${zipPath}`);

      const cloneCommand = `git clone ${githubRepo} "${clonePath}"`;
      console.log(`Cloning repository: ${githubRepo} into ${clonePath}`);

      exec(cloneCommand, async (error, stdout, stderr) => {
        if (error) {
          console.error("Error cloning repository:", stderr);
          return res
            .status(400)
            .json({ message: "Failed to clone repository", error: stderr });
        }

        console.log("Repository cloned successfully!");

        try {
          const project = new Project({
            userId,
            title,
            description,
            githubRepo,
            clonedPath: clonePath,
            zipFilePath: zipPath,
            demoVideoPath,
          });

          await project.save();
          console.log("Project details saved successfully!");

          res.status(201).json({
            message:
              "GitHub repository cloned and ZIP file downloaded successfully",
            project,
          });
        } catch (dbError) {
          console.error("Database error:", dbError);
          res
            .status(500)
            .json({ message: "Database save failed", error: dbError.message });
        }
      });
    });

    writer.on("error", (err) => {
      console.error("Error saving ZIP file:", err);
      res
        .status(500)
        .json({ message: "Failed to save ZIP file", error: err.message });
    });
  } catch (error) {
    console.error("Error in processing repository:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { upload };

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "userId",
      "name username email profilePicture"
    );
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId).populate("userId", "name username");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

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
    console.error("Error fetching saved projects:", error);
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
