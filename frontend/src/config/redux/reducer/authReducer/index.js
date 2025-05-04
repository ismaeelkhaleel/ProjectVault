import { createSlice } from "@reduxjs/toolkit";
import {
  register,
  login,
  verifyOTP,
  resendOTP,
  forgotPassword,
  updatePassword,
  getUserProfile,
  updateMyProfile,
  updateProfilePicture,
  getUserFollowerList,
  getUserFollowingList,
  followUser,
  unfollowUser,
  getHeatMap,
  getRecommendedProfiles,
} from "../../action/authAction";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  otpResent: false,
  loggedIn: false,
  message: "",
  userFollowerList: [],
  userFollowingList: [],
  userActivityData: [],
  recommendProfiles: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.otpResent = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering You...";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action.payload;
        state.message =
          action.payload || "Registration successful! Verify OTP.";
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload || "Registration failed.";
      })
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.message = "Verifying OTP...";
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action.payload;
        state.message = "OTP Verified";
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(resendOTP.pending, (state) => {
        state.isLoading = true;
        state.message = "Resending OTP...";
      })
      .addCase(resendOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpResent = true;
        state.isError = false;
        state.message = action.payload.message || "OTP Resent Successfully";
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message || "OTP cannot be resent";
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.message = "Sending OTP...";
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action.payload;
        state.message = action.payload.message || "OTP Sent Successfully";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message || "OTP cannot be sent";
      })
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.message = "Updating Password...";
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action.payload;
        state.message =
          action.payload.message || "Password Updated Successfully";
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message || "Password can not be updated";
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.message = "Logging In...";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.loggedIn = true;
        state.user = action.payload;
        state.message = action.payload.message || "Login Successful";
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Login Failed";
      })
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.message = "Loading Profile...";
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action.payload;
        state.message = action.payload.message || "Profile Loaded Successfully";
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Profile can not be loaded";
      })
      .addCase(updateProfilePicture.pending, (state) => {
        state.isLoading = true;
        state.message = "Uploading Profile Picture...";
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action.payload;
        state.message =
          action.payload.message || "Profile Picture Updated Successfully";
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload?.message || "Profile Picture can not be updated";
      })
      .addCase(updateMyProfile.pending, (state) => {
        state.isLoading = true;
        state.message = "Updating Profile...";
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action.payload;
        state.message =
          action.payload.message || "Profile Updated Successfully";
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Profile can not be updated";
      })
      .addCase(getUserFollowerList.pending, (state) => {
        state.isLoading = true;
        state.message = "Loading Followers...";
      })
      .addCase(getUserFollowerList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.userFollowerList = action.payload.followers;
        state.message =
          action.payload.message || "Followers Loaded Successfully";
      })
      .addCase(getUserFollowerList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload?.message || "Followers can not be loaded";
      })
      .addCase(getUserFollowingList.pending, (state) => {
        state.isLoading = true;
        state.message = "Loading Following...";
      })
      .addCase(getUserFollowingList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.userFollowingList = action.payload.following;
        state.message =
          action.payload.message || "Following Loaded Successfully";
      })
      .addCase(getUserFollowingList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload?.message || "Following can not be loaded";
      })
      .addCase(followUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Following...";
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload.message || "Following Successfully";
      })
      .addCase(followUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message || "Following can not be done";
      })
      .addCase(unfollowUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Unfollowing...";
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload.message || "Unfollowing Successfully";
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message || "Unfollowing can not be done";
      })
      .addCase(getHeatMap.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "Fetching activity data...";
      })
      .addCase(getHeatMap.fulfilled, (state, action) => {
        state.isLoading = true;
        state.isError = false;
        state.userActivityData = action.payload;
        state.message =
          action?.payload?.message || "Fetched User activity Data";
      })
      .addCase(getHeatMap.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action?.payload?.message || "Error in fetching user activity data";
      })
      .addCase(getRecommendedProfiles.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "Fetching recommended profiles...";
      })
      .addCase(getRecommendedProfiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.recommendProfiles = action.payload;
        state.message =
          action?.payload?.message || "Fetched Recommended Profiles";
      })
      .addCase(getRecommendedProfiles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action?.payload?.message || "Error in fetching recommended profiles";
      });
  },
});

export default authSlice.reducer;
export const { reset } = authSlice.actions;
