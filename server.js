const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./databases/database");
const path = require('path');
const {
  errorMiddleware,
  notFound,
  errorHandler,
} = require("./middleware/error");
const chats = require("./data/data");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chatRouter");
const messageRouter = require("./routes/messageRouter");
const { Connection } = require("mongoose");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/chat", chatRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);


const __dirname1 = path.resolve();

  app.get("/", (req, res) => {
    res.send("API is running..");
  })
 



app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => console.log("Server is connected !!"));

const io = require("socket.io")(server, {
  pinTimeout: 6000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  // Event: Setup
  socket.on("setup", (userData) => {
    // Join the socket room using the user's ID
    const userRoom = "current User :" + userData._id;
    socket.join(userRoom);
    console.log(`User ${userData._id} connected and joined room ${userRoom}`);

    // Emit a 'connected' event back to the connected client
    socket.emit("connected");
  });

  // Event: Join Chat
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined chat room ${room}`);
  });





  // Event: New Message
  socket.on("newMessage", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;
  
    if (!chat.users) return console.log("Chat users not defined!!");
  
    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return; // Skip the sender
  
      const recipientRoom = "current User :" + user._id;
      socket.to(recipientRoom).emit("message received", newMessageRecieved);
      console.log(`Message sent to user ${user._id} in room ${recipientRoom}`);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
  
});