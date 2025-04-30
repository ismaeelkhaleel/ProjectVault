import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "../../../index";

export const postComment = createAsyncThunk(
  "comment/post",
  async (Comment, thunkAPI) => {
    try {
      const response = await clientServer.post(
        `/post-comment/${Comment.projectId}`,
        {
          content: Comment.content,
          parentId: Comment.parentId,
          userId: Comment.userId,
        }
      );
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

export const likeComment = createAsyncThunk(
  "comment/like",
  async ({ commentId, userId }, thunkAPI) => {
    try {
      const response = await clientServer.post(`/like-comment/${commentId}`, {
        userId,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Comment can not be Liked";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const dislikeComment = createAsyncThunk(
  "comment/dislike",
  async ({ commentId, userId }, thunkAPI) => {
    try {
      const response = await clientServer.post(
        `/dislike-comment/${commentId}`,
        {
          userId,
        }
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Comment can not be Disliked";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const editComment = createAsyncThunk(
  "comment/edit",
  async ({ commentId, content }, thunkAPI) => {
    try {
      const response = await clientServer.put(`/edit-comment/${commentId}`, {
        content,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Comment can not be Edited";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/delete",
  async ({ commentId, projectId }, thunkAPI) => {
    try {
      const response = await clientServer.delete(
        `/delete-comment/${commentId}`,
        {
          data: {
            projectId,
          },
        }
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Comment can not be Deleted";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);
