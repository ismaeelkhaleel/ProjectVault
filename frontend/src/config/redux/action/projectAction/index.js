import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "../../../index";

export const uploadProject = createAsyncThunk(
  "project/createNew",
  async (formDataToSubmit, thunkAPI) => {
    try {
      const response = await clientServer.post(
        `/create-project`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed to upload project";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

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
export const getCommentedProjects = createAsyncThunk(
  "user/getCommentedProjects",
  async (userId, thunkAPI) => {
    try {
      const response = await clientServer.get(
        `/get-commented-projects/${userId}`
      );
      console.log(response.data);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed to get Commented projects";
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

export const incrementLikes = createAsyncThunk(
  "project/incrementLikes",
  async ({ projectId, userId }, thunkAPI) => {
    try {
      const response = await clientServer.post(
        `/increment-likes/${projectId}`,
        {
          userId,
        }
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage = err.response?.data?.message || "Failed like project";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const decrementLikes = createAsyncThunk(
  "project/decrementLikes",
  async ({ projectId, userId }, thunkAPI) => {
    try {
      const response = await clientServer.post(
        `/decrement-likes/${projectId}`,
        {
          userId,
        }
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage = err.response?.data?.message || "Failed unlike project";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const incrementViews = createAsyncThunk(
  "project/incrementViews",
  async (projectId, thunkAPI) => {
    try {
      const response = await clientServer.post(`/increment-views/${projectId}`);

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage = err.response?.data?.message || "Failed view project";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const getCodeTree = createAsyncThunk(
  "project/getCodeStructure",
  async (projectId, thunkAPI) => {
    try {
      const response = await clientServer.get(`/code-tree/${projectId}`);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed view project code tree";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const getFileContent = createAsyncThunk(
  "project/getFileContent",
  async ({ projectId, filePath }, thunkAPI) => {
    try {
      const response = await clientServer.get(
        `/project/${projectId}/fileContent?filePath=${filePath}`
      );
      console.log(response.data);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage = err.response?.data?.message || "Failed to get code";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const getRecommendedProjects = createAsyncThunk(
  "user/getRecommendedProjects",
  async (userId, thunkAPI) => {
    try {
      const response = await clientServer.get(
        `/user/recommend-projects/${userId}`
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Failed to get recommended projects";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);
