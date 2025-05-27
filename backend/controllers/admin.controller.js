import express from "express";
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import Comment from "../models/comment.model.js";
import { sendNotification } from "../utils/sendNotification.js";

export const getUnVerifiedProfiles = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", error: true });
    }

    if (user.type === "user") {
      return res.status(403).json({
        message: "Access denied: Only admin can verify profiles",
        error: true,
      });
    }

    const profiles = await Profile.find({
      verifRequest: true,
      verified: false,
    }).populate("user", "name username email profilePicture");

    return res
      .status(200)
      .json({ message: "Profiles fetched successfully", profiles });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error while fetching profiles" });
  }
};

export const verifyProfile = async (req, res) => {
  try {
    const profileId = req.params.id;
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.verified) {
      return res.status(400).json({ message: "Profile is already verified" });
    }

    profile.verified = true;
    await profile.save();

    await sendNotification({
      recipientId: profile.user.toString(),
      type: "verified",
    });

    return res
      .status(200)
      .json({ message: "Profile verified successfully", profile });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error while verifying profile" });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const profileId = req.params.id;
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.verifRequest = false;
    await profile.save();

    await sendNotification({
      recipientId: profile.user.toString(),
      type: "rejected",
    });

    return res.status(200).json({
      message: "Verification request rejected",
      profile,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error while rejecting request" });
  }
};

export const getProfileByAdmin = async (req, res) => {
  try {
    const profileId = req.params.id;
    const profile = await Profile.findById(profileId).populate(
      "user",
      "name username email profilePicture blocked"
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res
      .status(200)
      .json({ message: "Profiles fetched successfully", profile });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error while fetching profile" });
  }
};

export const getUserCount = async (req, res) => {
  try {
    const usersWithProfiles = await User.aggregate([
      { $match: { type: "user" } },
      {
        $lookup: {
          from: "profiles",
          localField: "_id",
          foreignField: "user",
          as: "profileData",
        },
      },
      {
        $unwind: {
          path: "$profileData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          password: 0,
          otp: 0,
          otpExpires: 0,
          otpVerified: 0,
          __v: 0,
          "profileData.__v": 0,
          "profileData.createdAt": 0,
          "profileData.updatedAt": 0,
        },
      },
    ]);
    res.json({
      totalUsers: usersWithProfiles.length,
      users: usersWithProfiles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users with profiles" });
  }
};

export const getProjectCount = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "userId",
      "name username email profilePicture"
    );
    const totalProjects = projects.length;
    const totalViews = projects.reduce(
      (sum, project) => sum + (project.views || 0),
      0
    );

    res.json({
      totalProjects,
      totalViews,
      projects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching projects" });
  }
};

export const getCommentCount = async (req, res) => {
  try {
    const comment = await Comment.find();
    const count = comment.length;
    res.json(count);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching comment" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await Profile.findOne({ user: user._id });

    if (!user.blocked) {
      profile.verifRequest = false;
      profile.verified = false;
      await profile.save();
    }

    user.blocked = !user.blocked;
    await user.save();

    res.json({
      message: `User ${user.blocked ? "blocked" : "unblocked"}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error blocking/unblocking user" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting project" });
  }
};
