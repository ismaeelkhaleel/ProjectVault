import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer/index";
import projectReducer from "./reducer/projectReducer/index";
 
 
 
 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
  },
});
