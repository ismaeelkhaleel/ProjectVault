// index.js or main.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import userActivityRoutes from "./routes/userActivity.routes.js";
import recommendRoutes from "./routes/recommend.routes.js";
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes from './routes/admin.routes.js';

import { socketHandler, onlineUsers } from "./sockets/socketHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(projectRoutes);
app.use(commentRoutes);
app.use(userActivityRoutes);
app.use(recommendRoutes);
app.use(notificationRoutes);
app.use(adminRoutes);
app.use("/uploads", express.static("uploads"));

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // change as per your frontend origin
    credentials: true,
  },
});

// Handle socket connections
socketHandler(io);

// Connect MongoDB and start server
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to DB:", err);
  }
};

// Export for use in sendNotification.js
export { io, onlineUsers };

start();