import { createSlice } from "@reduxjs/toolkit";

import {
  postComment,
  getAllComments,
  likeComment,
  dislikeComment,
} from "../../action/commentAction";

const initialState = {
  comments: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const commentSlice = createSlice({
  name: "comment",
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
      .addCase(postComment.pending, (state) => {
        state.isLoading = true;
        state.message = "Comment posting...";
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message =
          action?.payload?.message || "Comment posted Successfully";
      })
      .addCase(postComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action?.payload?.message || "Comment can not be posted";
      })
      .addCase(getAllComments.pending, (state) => {
        state.isLoading = true;
        state.message = "Comments fetching...";
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.comments = action.payload;
        state.message =
          action?.payload?.message || "Comments fetched Successfully";
      })
      .addCase(getAllComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action?.payload?.message || "Comments can not be fetched";
      })
      .addCase(likeComment.pending, (state) => {
        state.isLoading = true;
        state.message = "Comment liking...";
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message =
          action?.payload?.message || "Comment Liked Successfully";
      })
      .addCase(likeComment.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message = action?.payload?.message || "Comment Can not be liked";
      })
      .addCase(dislikeComment.pending, (state) => {
        state.isLoading = true;
        state.message = "Comment disliking...";
      })
      .addCase(dislikeComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message =
          action?.payload?.message || "Comment Disliked Successfully";
      })
      .addCase(dislikeComment.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message =
          action?.payload?.message || "Comment Can not be disliked";
      });
  },
});

export default commentSlice.reducer;
export const { reset } = commentSlice.actions;
