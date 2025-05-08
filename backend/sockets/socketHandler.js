// sockets/socketHandler.js
let onlineUsers = new Map(); // This stores userId => socketId

// This function handles the socket connection and sets up the necessary events
const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register user socket when they login or connect
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id); // Map userId to socketId
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    // Listen for disconnections and clean up
    socket.on("disconnect", () => {
      // Remove the user from the onlineUsers map on disconnection
      onlineUsers.forEach((value, key) => {
        if (value === socket.id) {
          onlineUsers.delete(key);
          console.log(`User ${key} disconnected and removed`);
        }
      });
    });

    // Optionally handle other events (like typing, messaging, etc.)
  });
};

export { socketHandler, onlineUsers };
