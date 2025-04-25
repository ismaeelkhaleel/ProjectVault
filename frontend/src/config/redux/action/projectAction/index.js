import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "../../../index";

export const getProjectById = createAsyncThunk(
  "project/getProjectById",
  async (id, thunkAPI) => {
    try {
      const response = await clientServer.get(`/get-project-by-id/${id}`);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || " Failed to get project by id";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const getUserProjects = createAsyncThunk(
  "user/getUserProjects",
  async (userId, thunkAPI) => {
    try {
      const response = await clientServer.get(`/get-user-project/${userId}`);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed to get user projects";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const saveProject = createAsyncThunk(
  "user/saveProject",
  async ({ projectId, userId }, thunkAPI) => {
    try {
      const response = await clientServer.put(`/save-project/${projectId}`, {
        userId,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed to save project";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const unsaveProject = createAsyncThunk(
  "user/unsaveProject",
  async ({ projectId, userId }, thunkAPI) => {
    try {
      const response = await clientServer.put(`/un-save-project/${projectId}`, {
        userId,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed to unsave project";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const getLikedProjects = createAsyncThunk(
  "user/getLikedProjects",
  async (userId, thunkAPI) => {
    try {
      const response = await clientServer.get(`/get-liked-projects/${userId}`);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed to get liked projects";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const getSavedProjects = createAsyncThunk(
  "user/getSavedProjects",
  async (userId, thunkAPI) => {
    try {
      const response = await clientServer.get(`/get-saved-projects/${userId}`);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed to get saved projects";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const getAllProjects = createAsyncThunk(
  "getAllProjects",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get(`/get-all-projects`);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed to get all projects";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);
