import { Router } from "express";

import { heatMap } from "../controllers/userActivity.controller.js";

const router = Router();

router.get("/user/activity-data/:id", heatMap);

export default router;