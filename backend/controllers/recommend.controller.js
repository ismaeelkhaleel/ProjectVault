import axios from "axios";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import Profile from "../models/profile.model.js";

export const getRecommendedProjects = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const profile = await Profile.findOne({ user: user._id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    const projects = await Project.find({}).lean();
    const response = await axios.post(
      "http://localhost:5001/recommend_projects",
      {
        skills: profile.skills || [],
        projects: projects,
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting recommendations");
  }
};

export const getRecommendedProfiles = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = await Profile.findOne({ user: user._id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const otherProfiles = await Profile.aggregate([
      {
        $match: {
          user: { $ne: user._id },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: {
          "user.type": "user",
        },
      },
      {
        $project: {
          _id: 1,
          bio: 1,
          skills: 1,
          user: {
            _id: 1,
            name: 1,
            username: 1,
            profilePicture: 1,
            followers: 1,
            following: 1,
          },
        },
      },
    ]);

    const response = await axios.post(
      "http://localhost:5001/recommend-profiles",
      {
        bio: profile.bio || "",
        skills: profile.skills || [],
        profiles: otherProfiles,
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting profile recommendations");
  }
};
