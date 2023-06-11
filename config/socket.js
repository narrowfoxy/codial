const express = require("express");
const { Server } = require("socket.io");
const Friend = require("../models/Friend");
const socketApp = express();
// Express creates a server for you and starts it
const server = socketApp.listen(3000);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", function (socket) {
  socket.emit("connection_done", "connected to server");
  // Start the heartbeat mechanism

  io.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

  socket.on("join", function (data) {
    socket.join(data.email);
    console.log(io.sockets.adapter.rooms.get(data.email), data.email);
  });

  socket.on("requestShown", async function ({ friendId }) {
    console.log("notified by friend");
    await Friend.findByIdAndUpdate(friendId, {
      notified: true,
    });
  });
});

module.exports = io;
