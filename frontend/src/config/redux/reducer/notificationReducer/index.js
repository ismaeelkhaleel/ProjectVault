import { createSlice } from "@reduxjs/toolkit";

import {
  getAllNotifications,
  markAsSeen,
  deleteAllNotifications,
  deleteNotification,
} from "../../action/NotificationAction/index";

const initialState = {
  notifications: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const notificationSlice = createSlice({
  name: "notification",
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
      .addCase(getAllNotifications.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "notification is loading";
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notifications = action.payload;
        state.isError = false;
        state.message = action?.payload?.message || "notification is loaded";
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action?.payload?.message || "notification is failed";
      })
      .addCase(markAsSeen.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "notification is loading";
      })
      .addCase(markAsSeen.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message =
          action?.payload?.message || "notification is marked as seen";
      })
      .addCase(markAsSeen.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message =
          action?.payload?.message || "notification is failed to mark";
      })
      .addCase(deleteAllNotifications.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "notification is loading";
      })
      .addCase(deleteAllNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action?.payload?.message || "all notifications deleted";
        state.notifications = [];
      })

      .addCase(deleteAllNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message =
          action?.payload?.message || "notification is failed to delete";
      })
      .addCase(deleteNotification.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "notification is loading";
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action?.payload?.message || "notification is deleted";
        state.notifications = state.notifications?.filter(
          (n) => n._id !== action.payload.notificationId
        );
      })

      .addCase(deleteNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message =
          action?.payload?.message || "notification is failed to delete";
      });
  },
});

export default notificationSlice.reducer;
export const { reset } = notificationSlice.actions;
