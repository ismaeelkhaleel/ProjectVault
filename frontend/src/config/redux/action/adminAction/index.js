import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "../../../index";

export const getUnVerifiedProfiles = createAsyncThunk(
  "/getUnVerifiedProfiles",
  async (userId, thunkAPI) => {
    try {
      const response = await clientServer.get(
        `/get-all-unverified-profiles/${userId}`
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "profiles can not be fetched!";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const verifyProfile = createAsyncThunk(
  "/verifyProfile",
  async (profileId, thunkAPI) => {
    try {
      const response = await clientServer.put(`/verify-profile/${profileId}`);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "profile can not be verified!";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const rejectRequest = createAsyncThunk(
  "/rejectRequest",
  async (profileId, thunkAPI) => {
    try {
      const response = await clientServer.put(`/reject-profile/${profileId}`);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "profile can not be rejected!";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const getProfileByAdmin = createAsyncThunk(
  "/getProfileByAdmin",
  async (profileId, thunkAPI) => {
    try {
      const response = await clientServer.get(
        `/get-profile-by-admin/${profileId}`
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "profiles can not be fetched!";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const getUserCount = createAsyncThunk(
  "/getAllUserAndCount",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/get-all-users");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "users can not be fetched!";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const getProjectCount = createAsyncThunk(
  "/getAllProjectAndCount",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/get-all-projects-by-admin");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "projects can not be fetched!";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);
export const getCommentCount = createAsyncThunk(
  "/getCommentCount",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/get-comment-count");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Comment Count can not be fetched!";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const blockAndUnblockUser = createAsyncThunk(
  "/blockAndUnblockUser",
  async (userId, thunkAPI) => {
    try {
      const response = await clientServer.put(`/block-unblock-user/${userId}`);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "user can not be block or unblock!";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const deleteProject = createAsyncThunk(
  "/deleteProject",
  async (projectId, thunkAPI) => {
    try {
      const response = await clientServer.delete(
        `/delete-project/${projectId}`
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "project can not be deleted";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);
