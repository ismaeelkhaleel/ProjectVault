import { createSlice } from "@reduxjs/toolkit";

import {
  getUnVerifiedProfiles,
  verifyProfile,
  rejectRequest,
  getProfileByAdmin,
  getProjectCount,
  getUserCount,
  blockAndUnblockUser,
  deleteProject,
  getCommentCount,
} from "../../action/adminAction/index";

const initialState = {
  unVerifiedProfiles: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  unVerifiedProfileDetail: null,
  userCount: null,
  projectCount: null,
  commentCount: null,
};

const notificationSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    reset: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUnVerifiedProfiles.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "Profiles fetching...";
      })
      .addCase(getUnVerifiedProfiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.unVerifiedProfiles = action.payload;
        state.message = "Profiles fetched successfully";
      })
      .addCase(getUnVerifiedProfiles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = " Error fetching profiles";
      })
      .addCase(verifyProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "Profile verification in progress...";
      })
      .addCase(verifyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Profile verified successfully";
      })
      .addCase(verifyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Error verifying profile";
      })
      .addCase(rejectRequest.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "Request rejection in progress...";
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Request rejected successfully";
      })
      .addCase(rejectRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Error rejecting request";
      })
      .addCase(getProfileByAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "Fetching detail in progress...";
      })
      .addCase(getProfileByAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.unVerifiedProfileDetail = action.payload;
        state.message = "Detail fetched successfully";
      })
      .addCase(getProfileByAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Detail can not be fetched";
      })
      .addCase(getUserCount.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "Fetching user in progress...";
      })
      .addCase(getUserCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.userCount = action.payload;
        state.message = "user fetched successfully";
      })
      .addCase(getUserCount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "user can not be fetched";
      })
      .addCase(getProjectCount.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "Fetching project in progress...";
      })
      .addCase(getProjectCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.projectCount = action.payload;
        state.message = "project fetched successfully";
      })
      .addCase(getProjectCount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "project can not be fetched";
      })
      .addCase(blockAndUnblockUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = " blocking or unblocking project in progress...";
      })
      .addCase(blockAndUnblockUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "project blocked or unblocked successfully";
      })
      .addCase(blockAndUnblockUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "user can not be blocked or unblocked";
      })
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "deleting project in progress...";
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "project deleted successfully";
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "project can not be deleted";
      })
      .addCase(getCommentCount.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "fetching Comment count in progress...";
      })
      .addCase(getCommentCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.commentCount = action?.payload;
        state.message = "Comment count fetched successfully";
      })
      .addCase(getCommentCount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Comment count can not be fetched";
      });
  },
});

export default notificationSlice.reducer;
export const { reset } = notificationSlice.actions;
