import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    likeBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likes : {
        type : Number,
        default : 0
    }
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;