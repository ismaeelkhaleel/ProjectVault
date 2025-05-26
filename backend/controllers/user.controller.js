import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Profile from "../models/profile.model.js";
import UserActivity from "../models/userActivity.model.js";
import nodemailer from "nodemailer";
import multer from "multer";
import { sendNotification } from "../utils/sendNotification.js";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const username = req.user?.username || "anonymous";
    const ext = file.originalname.split(".").pop();
    const filename = `${Date.now()}-${username}.${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and PDFs are allowed"), false);
  }
};

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email OTP verification",
    text: `Your OTP is ${otp} for ProjectVault, please enter it to verify your email address. it will expire in 10 minutes`,
  };

  await transporter.sendMail(mailOptions);
};

export const register = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      otp: hashedOTP,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    await newUser.save();
    await sendOTPEmail(email, otp);

    return res.status(201).json({
      message: "User registered! Please verify OTP",
      userId: newUser._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOTP = async (req, res) => {
  const { otp } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP expired, please request a new one" });
    }

    if (!otp || !user.otp) {
      return res.status(400).json({ message: "OTP missing or invalid" });
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otpVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const newProfile = new Profile({ user: user._id });
    await newProfile.save();

    return res
      .status(200)
      .json({ message: "OTP verified, please log in", userId: user._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resendOtp = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otpVerified) {
      return res.status(400).json({ message: "OTP already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.otp = hashedOTP;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    user.otpVerified = false;

    await user.save();
    await sendOTPEmail(user.email, otp);

    return res
      .status(200)
      .json({ message: "OTP resent successfully", userId: userId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.otp = hashedOTP;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    user.otpVerified = false;

    await user.save();
    await sendOTPEmail(email, otp);

    return res
      .status(200)
      .json({ message: "OTP sent successfully", userId: user._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePassword = async (req, res) => {
  const { otp, newPassword } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpires = null;
    user.otpVerified = true;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (!user.otpVerified) {
      return res.status(400).json({ message: "Please verify Your Email" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    await UserActivity.create({
      userId: user._id,
      activityType: "login",
      activityDate: new Date(),
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      type: user.type,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const upload = multer({ storage, fileFilter });

export const updateProfilePicture = async (req, res) => {
  const userId = req.params.id;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filename = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: filename },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile picture updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  const { bio, course, enrollNumber, facNumber, skills } = req.body;
  const idCard = req.file ? req.file.path.replace(/\\/g, "/") : null;
  const userId = req.params.id;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.bio = bio || profile.bio;
    profile.course = course || profile.course;
    profile.enrollNumber = enrollNumber || profile.enrollNumber;
    profile.facNumber = facNumber || profile.facNumber;
    profile.verifRequest = true;

    if (idCard) {
      profile.idCard = idCard;
    }

    let parsedSkills = skills;
    if (typeof skills === "string") {
      try {
        parsedSkills = JSON.parse(skills);
      } catch (err) {
        console.error("Error parsing skills JSON:", err);
        parsedSkills = [];
      }
    }
    if (Array.isArray(parsedSkills)) {
      profile.skills = parsedSkills;
    }

    await profile.save();

    return res
      .status(200)
      .json({ message: "Profile updated successfully", profile });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { upload };

export const deleteProfileAndUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.deleteOne({ _id: userId });

    await Profile.deleteOne({ user: userId });
    return res
      .status(200)
      .json({ message: "User and profile deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsersProfiles = async (req, res) => {
  try {
    const profiles = await Profile.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $match: {
          "userDetails.type": "user",
        },
      },
      {
        $addFields: {
          followersCount: { $size: "$userDetails.followers" },
          createdAt: "$userDetails.createdAt",
        },
      },
      {
        $sort: {
          followersCount: -1,
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          bio: 1,
          skills: 1,
          course: 1,
          user: {
            _id: "$userDetails._id",
            name: "$userDetails.name",
            username: "$userDetails.username",
            email: "$userDetails.email",
            profilePicture: "$userDetails.profilePicture",
            followers: "$userDetails.followers",
          },
        },
      },
    ]);

    return res.status(200).json(profiles);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfileByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const profile = await Profile.findById({ username }).populate(
      "user",
      "name username email profilePicture"
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.status(200).json({ message: "Profile found", profile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.params.id;
  try {
    const profile = await Profile.findOne({ user: userId }).populate(
      "user",
      "name username email profilePicture followers following saveProjects likeProjects commentProjects"
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.status(200).json({ message: "Profile found", profile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const followUser = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    if (id === userId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(userId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToFollow.followers.includes(userId)) {
      return res.status(400).json({ message: "You already follow this user" });
    }

    userToFollow.followers.push(userId);
    await userToFollow.save();

    currentUser.following.push(id);
    await currentUser.save();

    await sendNotification({
      recipientId: id,
      senderId: userId,
      type: "follow",
    });

    return res.status(200).json({ message: "User followed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const unfollowUser = async (req, res) => {
  const { id } = req.params; // user to unfollow
  const { userId } = req.body; // current logged-in user

  try {
    if (id === userId) {
      return res.status(400).json({ message: "You can't unfollow yourself" });
    }

    const userToUnfollow = await User.findById(id);
    const currentUser = await User.findById(userId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if not following
    if (!userToUnfollow.followers.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You're not following this user" });
    }

    // Remove follower from the user's followers
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (followerId) => followerId.toString() !== userId
    );
    await userToUnfollow.save();

    currentUser.following = currentUser.following.filter(
      (followingId) => followingId.toString() !== id
    );
    await currentUser.save();

    return res.status(200).json({ message: "User unfollowed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserFollowerList = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate({
      path: "followers",
      select: "_id name username profilePicture",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserFollowingList = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate({
      path: "following",
      select: "_id name username profilePicture",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};