const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

let rooms = [{ room: "", users: [""] }];

const AddRoom = (nameRoom, rooms) => {
  const found = rooms.find(({ room }) => room === nameRoom);
  return found || rooms.push({ room: nameRoom });
};

const AddUserToRoom = (user, rooms, nameRoom) => {
  const found = rooms.find(({ room }) => room === nameRoom);
  if (!found.users) {
    return (found.users = [user]);
  }
  return found.users.push(user);
};

const RemoverRoom = (r) => {
  return r.filter(({ users }) => users.length > 0);
};

const RemoverUserToRoom = (user, rooms) => {
  const found = rooms.find(({ users }) => users.includes(user));
  if (!found) return "";
  found.users.splice(found.users.indexOf(user), 1);
  return found.room;
};

const showConnectRoom = (nameRoom, rooms) => {
  const found = rooms.find(({ room }) => room === nameRoom);
  return found.users.length;
};

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  socket.on("join_room", async (data) => {
    socket.join(data);

    AddRoom(data, rooms);
    AddUserToRoom(socket.id, rooms, data);
    socket.to(data).emit("user", showConnectRoom(data, rooms));
    socket.emit("user", showConnectRoom(data, rooms));
    io.emit("rooms", rooms.length - 1);
  });

  socket.on("disconnect", () => {
    const room = RemoverUserToRoom(socket.id, rooms);
    socket.to(room).emit("user", showConnectRoom(room, rooms));
    rooms = RemoverRoom(rooms);
    io.emit("rooms", rooms.length - 1);
  });

  socket.on("send", (data) => {
    socket.to(data.room).emit("receive", data);
  });
  io.emit("rooms", rooms.length - 1);
  console.log(rooms);
});

server.listen(3001, () => {
  console.log("Server On Line");
});
