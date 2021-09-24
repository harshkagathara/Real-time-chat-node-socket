const express = require("express");
const app = express();
const dateTime = require("simple-datetime-formater");
const bodyParser = require("body-parser");
const chatRouter = require("./App/route/chatroute");

var server = require("http").createServer(app);
var io = require("socket.io")(server);

const port = 5000;

app.use(bodyParser.json());

app.use("/chats", chatRouter);

app.use(express.static(__dirname + "/public"));

const Chat = require("./App/models/Chat");
const connect = require("./App/db");

io.on("connection", (socket) => {
  socket.on("join", function (name) {
    socket.userName = name;
    socket.broadcast.emit("chat message", name + " has joined the chat");
    console.log(name + " has joined the chat");

    socket.on("disconnect", function () {
      socket.broadcast.emit("chat message", name + " has left the chat");
      console.log(name + " has left the chat");
    });
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("notifyTyping", {
      user: data.user,
      message: data.message,
    });
  });


  socket.on("chat message", function (msg) {
    console.log("message: " + msg);


    socket.broadcast.emit("received", {
      message: msg,
      sender: socket.userName,
    });

    
    connect.then((db) => {
      console.log("connected correctly to the server");
      let chatMessage = new Chat({ message: msg, sender: socket.userName });

      chatMessage.save();
    });
  });
});

server.listen(port, () => {
  console.log("Running on Port: " + port);
});
