import { Router } from "express";
import {getRecommendedProjects} from "../controllers/recommend.controller.js"

const router = Router();

router.get("/user/recommend-projects/:id", getRecommendedProjects);

export default router;