import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
//import cors from "cors";

require("dotenv").config();

let app = express();
let port = process.env.PORT || 6969;

// fix cors

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//app.use(cors({ origin: true }));

// config app

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDB();

app.listen(port, () => {
  //callback
  console.log("backend nodejs is running on the port : " + port);
});

let io = require('socket.io')(8800, {
  cors: {
    origin: "http://localhost:3000",
  }
})
let users = [];
io.on("connection", (socket) => {
  socket.on('new-user-add', (newUserId) => {
    if (!users.some((user) => user.userId === newUserId)) {
      users.push({
        userId: newUserId,
        socketId: socket.id
      })
    }
    console.log("Connected Users", users)
    io.emit('get-users', users);
  })
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = users.find((user) => user.userId === receiverId)
    console.log("Sending from socket to : ", receiverId)
    console.log("data", data)
    if (user) {
      io.to(user.socketId).emit("receive-message", data)
    }
  })

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", users);
    io.emit('get-users', users);
  })
})

