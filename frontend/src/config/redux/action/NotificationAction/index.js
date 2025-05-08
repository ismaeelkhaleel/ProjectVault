import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "../../../index";

export const getAllNotifications = createAsyncThunk(
  "/getNotifications",
  async (userId, thunkAPI) => {
    try {
      const response = await clientServer.get(`/notification/${userId}`);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Notification can not be fetched!";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const markAsSeen = createAsyncThunk(
  "notification/markAsSeen",
  async (userId, thunkAPI) => {
    try {
      const response = await clientServer.put(
        `/notification/mark-as-seen/${userId}`
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message ||
        "Notification can not be marked as seen!";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const deleteAllNotifications = createAsyncThunk(
  "deleteAllNotifications",
  async (userId, thunkAPI) => {
    try {
      const response = await clientServer.delete(
        `/delete-all-notification/${userId}`
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Notification can not be deleted!";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "deleteNotification",
  async (notificationId, thunkAPI) => {
    try {
      await clientServer.delete(`/delete-notification/${notificationId}`);
      return thunkAPI.fulfillWithValue({ notificationId });
    } catch (err) {
      const errMessage =
        err.response?.data?.message || "Notification can not be deleted!";
      return thunkAPI.rejectWithValue({ message: errMessage });
    }
  }
);

