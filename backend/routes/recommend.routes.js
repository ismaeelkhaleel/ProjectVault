import { Router } from "express";
import {
  getRecommendedProjects,
  getRecommendedProfiles,
} from "../controllers/recommend.controller.js";

const router = Router();

router.get("/user/recommend-projects/:id", getRecommendedProjects);
router.get("/user/recommended-profiles/:id", getRecommendedProfiles);

export default router;
