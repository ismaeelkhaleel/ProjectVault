import { Router } from "express";
import {
  getUnVerifiedProfiles,
  verifyProfile,
  rejectRequest,
  getProfileByAdmin
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/get-all-unverified-profiles/:id", getUnVerifiedProfiles);
router.put("/verify-profile/:id", verifyProfile);
router.put("/reject-profile/:id", rejectRequest);
router.get("/get-profile-by-admin/:id", getProfileByAdmin);

export default router;
