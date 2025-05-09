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
