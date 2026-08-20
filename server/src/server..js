import { Server } from "socket.io";
import { createServer } from "http";
export const io = new Server({
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(`user:${userId}`);
  });

  socket.on("disconnect", (userId) => {
    console.log("User disconnected:", socket.id);
    socket.get(socket.userId)?.disconnect();
  });
});
const app = new createServer();
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
