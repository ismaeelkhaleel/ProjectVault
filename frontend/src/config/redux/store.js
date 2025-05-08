import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer/index";
import projectReducer from "./reducer/projectReducer/index";
import commentReducer from "./reducer/commentReducer/index";
import notificationReducer from "./reducer/notificationReducer/index";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    comment: commentReducer,
    notification: notificationReducer
  },
});
