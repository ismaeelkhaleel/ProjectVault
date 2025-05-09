import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "../../../index";

export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      const request = await clientServer.post("/register", {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
      });
      localStorage.setItem("userId", request.data.userId);
      return thunkAPI.fulfillWithValue(request.data);
    } catch (err) {
      const errMessage = err.response?.data?.message || "Registration failed";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verify-otp",
  async (user, thunkAPI) => {
    try {
      const userId = localStorage.getItem("userId");
      const request = await clientServer.post(`/verify-otp/${userId}`, {
        otp: user.otp,
      });
      return thunkAPI.fulfillWithValue(request.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "OTP verification failed";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const resendOTP = createAsyncThunk(
  "auth/resend-otp",
  async (user, thunkAPI) => {
    try {
      const userId = localStorage.getItem("userId");
      const request = await clientServer.post(`/resend-otp/${userId}`);
      return thunkAPI.fulfillWithValue(request.data);
    } catch (err) {
      const errMessage = err.response?.data?.message || "OTP resend failed";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async (user, thunkAPI) => {
    try {
      const request = await clientServer.post("/forgot-password", {
        email: user.email,
      });
      localStorage.setItem("userId", request.data.userId);
      return thunkAPI.fulfillWithValue(request.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Forgot password failed";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/update-password",
  async (user, thunkAPI) => {
    try {
      const userId = localStorage.getItem("userId");
      const request = await clientServer.post(`/update-password/${userId}`, {
        otp: user.otp,
        newPassword: user.newPassword,
      });
      return thunkAPI.fulfillWithValue(request.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Update password failed";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    const response = await clientServer.post("/login", {
      email: user.email,
      password: user.password,
    });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userId", response.data.userId);
    localStorage.setItem("loggedInUser", JSON.stringify(response.data));
    return thunkAPI.fulfillWithValue(response.data);
  } catch (err) {
    const errMessage = err.response?.data?.message || "Login failed";
    return thunkAPI.rejectWithValue({ message: errMessage });
  }
});

export const getUserByUsername = createAsyncThunk(
  "user/getByUsername",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get(
        `/get-profile-by-username/${user.username}`
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage = err.response?.data?.message || "Failed to get user";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "/your_profile",
  async (id, thunkAPI) => {
    try {
      const response = await clientServer.get(`/get-user-profile/${id}`);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage = err.response?.data?.message || "Failed to get user";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);
export const getAllProfiles = createAsyncThunk(
  "/getAllUserProfiles",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get(`/get-all-users-profiles`);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed to get all user profiles";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  "user/updateProfilePicture",
  async (formData, thunkAPI) => {
    try {
      const userId = localStorage.getItem("userId");

      const response = await clientServer.put(
        `/update-profile-picture/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("loggedInUser")),
        profilePicture: response.data.user.profilePicture,
      };

      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed to update profile picture";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const updateMyProfile = createAsyncThunk(
  "user/updateMyProfile",
  async (user, thunkAPI) => {
    try {
      const userId = localStorage.getItem("userId");

      const formData = new FormData();
      formData.append("bio", user.bio);
      formData.append("course", user.course);
      formData.append("enrollNumber", user.enrollNumber);
      formData.append("facNumber", user.facNumber);
      formData.append("skills", JSON.stringify(user.skills));
      if (user.idCard instanceof File) {
        formData.append("idCard", user.idCard);
      }

      const response = await clientServer.put(
        `/update-profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage = err.response?.data?.message || "Failed to update user";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const getUserFollowerList = createAsyncThunk(
  "user/getUserFollowerList",
  async (userId, thunkAPI) => {
    try {
      const response = await clientServer.get(
        `/get-user-follower-list/${userId}`
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed to get user followers";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const getUserFollowingList = createAsyncThunk(
  "user/getUserFollowingList",
  async (userId, thunkAPI) => {
    try {
      const response = await clientServer.get(
        `/get-user-following-list/${userId}`
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed to get user followers";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const followUser = createAsyncThunk(
  "user/followuser",
  async ({ userId, id }, thunkAPI) => {
    try {
      const response = await clientServer.put(`/follow-user/${id}`, {
        userId,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage = err.response?.data?.message || "Failed to follow user";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "user/unfollowUser",
  async ({ userId, id }, thunkAPI) => {
    try {
      const response = await clientServer.put(`/unfollow-user/${id}`, {
        userId,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed to unfollow user";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const getHeatMap = createAsyncThunk(
  "user/heatmap",
  async (userId, thunkAPI) => {
    try {
      const response = await clientServer.get(`/user/activity-data/${userId}`);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed to fetch user activity";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const getRecommendedProfiles = createAsyncThunk(
  "user/recommendedProfiles",
  async (userId, thunkAPI) => {
    try {
      const response = await clientServer.get(
        `/user/recommended-profiles/${userId}`
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed to fetch recommended profiles";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);
