import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 20,
      match: /^[a-zA-Z0-9_]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePicture: {
      type: String,
      default: "default.png",
    },
    type:{
      type:String,
      default:"user"
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    saveProjects: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: [] },
    ],
    likeProjects: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: [] },
    ],
    commentProjects: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: [] },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
