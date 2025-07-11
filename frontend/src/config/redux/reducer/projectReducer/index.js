import { createSlice } from "@reduxjs/toolkit";

import {
  uploadProject,
  getUserProjects,
  saveProject,
  unsaveProject,
  getLikedProjects,
  getSavedProjects,
  getProjectById,
  getAllProjects,
  incrementLikes,
  decrementLikes,
  incrementViews,
  getCodeTree,
  getFileContent,
  getCommentedProjects,
  getRecommendedProjects,
} from "../../action/projectAction";

const initialState = {
  projects: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  uploadSuccess: false,
  message: "",
  likedProjects: [],
  savedProjects: [],
  allProjects: [],
  commentedProjects: [],
  codeTree: null,
  selectedFile: null,
  recommendedProjects: [],
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    reset: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadProject.pending, (state) => {
        state.isLoading = true;
        state.message = "Uploading Projects...";
      })
      .addCase(uploadProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploadSuccess = true;
        state.message =
          action.payload.message || "Projects Uploaded Successfully";
      })
      .addCase(uploadProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message || "Failed to Upload Projects";
      })
      .addCase(getUserProjects.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching User Projects...";
      })
      .addCase(getUserProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message =
          action.payload.message || "User Projects Fetched Successfully";
        state.projects = action.payload;
      })
      .addCase(getUserProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload.message || "Failed to Fetch User Projects";
      })
      .addCase(saveProject.pending, (state) => {
        state.isLoading = true;
        state.message = "Saving Project...";
      })
      .addCase(saveProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Project Saved Successfully";
        state.savedProjects = action.payload;
      })
      .addCase(saveProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message || "Failed to Save Project";
      })
      .addCase(unsaveProject.pending, (state) => {
        state.isLoading = true;
        state.message = "Unsaving Project...";
      })
      .addCase(unsaveProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message =
          action.payload.message || "Project Unsaved Successfully";
        state.savedProjects = action.payload;
      })
      .addCase(unsaveProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message || "Failed to Unsave Project";
      })
      .addCase(getLikedProjects.pending, (state) => {
        state.isLoading = true;
        state.message = "Liking Project...";
      })
      .addCase(getLikedProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Project Liked Successfully";
        state.likedProjects = action.payload;
      })
      .addCase(getLikedProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message || "Failed to Like Project";
      })
      .addCase(getSavedProjects.pending, (state) => {
        state.isLoading = true;
        state.message = "Loading Saved Projects...";
      })
      .addCase(getSavedProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message =
          action.payload.message || "Saved Projects Loaded Successfully";
        state.savedProjects = action.payload;
      })
      .addCase(getSavedProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload.message || "Failed to Load Saved Projects";
      })
      .addCase(getCommentedProjects.pending, (state) => {
        state.isLoading = true;
        state.message = "Loading Commented Projects...";
      })
      .addCase(getCommentedProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message =
          action.payload.message || "Saved Projects Commented Successfully";
        state.commentedProjects = action.payload;
      })
      .addCase(getCommentedProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload.message || "Failed to Load commented Projects";
      })
      .addCase(getProjectById.pending, (state) => {
        state.isLoading = true;
        state.message = "Loading Project...";
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Project Loaded Successfully";
        state.projectDetails = action.payload;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message || "Failed to Load Project";
      })
      .addCase(getAllProjects.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching Projects...";
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Project Loaded Successfully";
        state.allProjects = action.payload;
      })
      .addCase(getAllProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action?.payload?.message || "Failed to fetch Project";
      })
      .addCase(incrementLikes.pending, (state) => {
        state.isLoading = true;
        state.message = "Liking Project...";
      })
      .addCase(incrementLikes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Project liked Successfully";
      })
      .addCase(incrementLikes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action?.payload?.message || "Failed to like Project";
      })
      .addCase(decrementLikes.pending, (state) => {
        state.isLoading = true;
        state.message = "UnLiking Project...";
      })
      .addCase(decrementLikes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message =
          action.payload.message || "Project Unliked Successfully";
      })
      .addCase(decrementLikes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action?.payload?.message || "Failed to Unlike Project";
      })
      .addCase(incrementViews.pending, (state) => {
        state.isLoading = true;
        state.message = "viewing Project...";
      })
      .addCase(incrementViews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Project viewed Successfully";
      })
      .addCase(incrementViews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action?.payload?.message || "Failed to view Project";
      })
      .addCase(getCodeTree.pending, (state) => {
        state.isLoading = true;
        state.message = "getting code tree...";
      })
      .addCase(getCodeTree.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.codeTree = action.payload;
        state.message = action?.payload?.message || "Code Structure fetched!";
      })
      .addCase(getCodeTree.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action?.payload?.message || "Code Structure Can not be fetched";
      })
      .addCase(getFileContent.pending, (state) => {
        state.isLoading = true;
        state.message = "Code Content fetching...";
      })
      .addCase(getFileContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.selectedFile = action.payload;
        state.message = action?.payload?.message || "Code Content fetched!";
      })
      .addCase(getFileContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action?.payload?.message || "Code content Can not be fetched";
      })
      .addCase(getRecommendedProjects.pending, (state) => {
        state.isLoading = true;
        state.message = "recommended projects fetching...";
      })
      .addCase(getRecommendedProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.recommendedProjects = action.payload;
        state.message =
          action?.payload?.message || "recommended projects fetched!";
      })
      .addCase(getRecommendedProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action?.payload?.message || "recommended projects Can not be fetched";
      });
  },
});

export default projectSlice.reducer;
export const { reset } = projectSlice.actions;
