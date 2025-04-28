import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "../../../index";

export const postComment = createAsyncThunk(
  "comment/post",
  async (Comment, thunkAPI) => {
    try {
      const response = await clientServer.post(`/post-comment/${Comment.projectId}`, {
        content: Comment.content,
        parentId: Comment.parentId,
        userId: Comment.userId,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Comment can not be post";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const getAllComments = createAsyncThunk(
  "comment/getAllComments",
  async (projectId, thunkAPI) => {
    try {
      const response = await clientServer.get(
        `/get-project-comments/${projectId}`
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Comment can not be fetched";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);
