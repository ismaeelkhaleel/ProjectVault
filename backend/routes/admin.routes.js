import { Router } from "express";
import {
  getUnVerifiedProfiles,
  verifyProfile,
  rejectRequest,
  getProfileByAdmin,
  getUserCount,
  getProjectCount,
  blockUser,
  deleteProject,
  getCommentCount
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/get-all-unverified-profiles/:id", getUnVerifiedProfiles);
router.put("/verify-profile/:id", verifyProfile);
router.put("/reject-profile/:id", rejectRequest);
router.get("/get-profile-by-admin/:id", getProfileByAdmin);
router.get("/get-all-users",getUserCount);
router.get("/get-all-projects-by-admin",getProjectCount);
router.put("/block-unblock-user/:id", blockUser);
router.delete("/delete-project/:id",deleteProject);
router.get("/get-comment-count", getCommentCount);

export default router;