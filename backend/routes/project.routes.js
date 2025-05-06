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
  incrementViews,
  getLikedProjects,
  getProjectById,
  getCodeTree,
  getFileContent,
  getCommentedProjects,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post(
  "/create-project",
  upload.fields([
    { name: "demoVideoPath", maxCount: 1 },
    { name: "desertationPath", maxCount: 1 },
  ]),
  uploadProject
);
router.get("/get-all-projects", getAllProjects);
router.get("/get-user-project/:id", getUserProjects);
router.get("/get-saved-projects/:id", getSavedProjects);
router.put("/save-project/:id", saveProject);
router.put("/un-save-project/:id", unSaveProject);
router.post("/increment-likes/:id", incrementLikes);
router.post("/decrement-likes/:id", deccrementLikes);
router.post("/increment-views/:id", incrementViews);
router.get("/get-liked-projects/:id", getLikedProjects);
router.get("/get-project-by-id/:id", getProjectById);
router.get("/code-tree/:id", getCodeTree);
router.get("/project/:id/fileContent", getFileContent);
router.get("/get-commented-projects/:id", getCommentedProjects);

export default router;
