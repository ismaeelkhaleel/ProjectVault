import Notification from '../models/notification.model.js';
import { io, onlineUsers } from '../index.js';

export async function sendNotification({ recipientId, senderId, type, projectId = null, commentId = null }) {
  const notification = await Notification.create({
    recipient: recipientId,
    sender: senderId,
    type,
    projectId,
    commentId,
  });

  const socketId = onlineUsers.get(String(recipientId)); // Get the recipient's socket ID
  if (socketId) {
    io.to(socketId).emit('notification', notification); // Emit notification to the recipient
  }
}