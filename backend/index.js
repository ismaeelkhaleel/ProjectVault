import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import userActivityRoutes from "./routes/userActivity.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(projectRoutes);
app.use(commentRoutes);
app.use(userActivityRoutes);
app.use("/uploads", express.static("uploads"));

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};

start();
