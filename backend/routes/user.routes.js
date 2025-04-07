import { Router } from "express";

import {
  register,
  verifyOTP,
  login,
  resendOtp,
  forgotPassword,
  updatePassword,
  updateProfile,
  upload,
  deleteProfileAndUser,
  getAllUsersProfiles,
  getProfileByUsername,
  getUserProfile,
  updateProfilePicture,
  followUser,
  unfollowUser,
  getUserFollowerList,
  getUserFollowingList,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/register", register);
router.post("/verify-otp/:id", verifyOTP);
router.post("/login", login);
router.post("/resend-otp/:id", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/update-password/:id", updatePassword);
router.put(
  "/update-profile-picture/:id",
  upload.single("profilePicture"),
  updateProfilePicture
);
router.put("/update-profile/:id", upload.single("idCard"), updateProfile);
router.delete("/delete-profile-and-user/:id", deleteProfileAndUser);
router.get("/get-all-users-profiles", getAllUsersProfiles);
router.get("/get-profile-by-username/:username", getProfileByUsername);
router.get("/get-user-profile/:id", getUserProfile);
router.put("/follow-user/:id", followUser);
router.put("/unfollow-user/:id", unfollowUser);
router.get("/get-user-follower-list/:id", getUserFollowerList);
router.get("/get-user-following-list/:id", getUserFollowingList);

export default router;
