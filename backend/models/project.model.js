import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    technology: {
      type: [String],
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    githubRepo: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+$/i.test(v);
        },
        message: "Invalid GitHub repository URL!",
      },
    },
    clonedPath: {
      type: String,
    },
    zipFilePath: {
      type: String,
    },
    demoVideoPath: {
      type: String,
    },
    desertationPath: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likeBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    totalComments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
