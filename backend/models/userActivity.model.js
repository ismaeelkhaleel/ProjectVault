import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  activityType: {
    type: String,
    enum: ["login", "comment", "like", "project_submission", "comment_like","project_save"],
  },
  activityDate: { type: Date, default: Date.now },
});

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

export default UserActivity;
