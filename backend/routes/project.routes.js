import express from "express";
import {
  uploadProject,
  getAllProjects,
  getUserProjects,
  getSavedProjects,
  saveProject,
  unSaveProject,
  upload,
  incrementLikes,
  deccrementLikes,
  incrementViews
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/create-project", upload.single("demoVideoPath"), uploadProject);
router.get("/get-all-project", getAllProjects);
router.get("/get-user-project/:id", getUserProjects);
router.get("/get-saved-project/:id", getSavedProjects);
router.put("/save-project/:id", saveProject);
router.put("/un-save-project/:id", unSaveProject);
router.post("/increment-likes/:id", incrementLikes);
router.post("/decrement-likes/:id", deccrementLikes);
router.post("/increment-views/:id", incrementViews);

export default router;