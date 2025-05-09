import express from "express";
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import {sendNotification} from "../utils/sendNotification.js"
// Get all unverified profiles (only admin can access)
export const getUnVerifiedProfiles = async (req, res) => {
  const userId = req.params.id;
  try {
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

// Verify a profile
export const verifyProfile = async (req, res) => {
  const profileId = req.params.id;
  try {
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.verified) {
      return res.status(400).json({ message: "Profile is already verified" });
    }
    console.log(profile);
    console.log(profile.user.toString());
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

// Reject verification request
export const rejectRequest = async (req, res) => {
  const profileId = req.params.id;
  try {
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    console.log(profile);
    console.log(profile.user.toString());
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
  const profileId = req.params.id;
  try {
    const profile = await Profile.findById(profileId).populate(
      "user",
      "name username email profilePicture"
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
