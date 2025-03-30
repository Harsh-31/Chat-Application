import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import msgsRouter from "./routes/msgs.route.js"
import connectToMongoDB from "./connectTOMongoDB.js";
import { addMsgToConversation } from "./controllers/msgs.controller.js";

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    allowedHeaders: ["*"],
    origin: "*",
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("Client Connected");
  const username = socket.handshake.query.username;
  console.log("Username:", username);

  userSocketMap[username] = socket;

  //socket.on("chat msg", (msg) => {
    // console.log(msg.sender);
    // console.log(msg.receiver);
    // console.log(msg.text);
    // console.log(msg);
    //socket.broadcast.emit("chat msg", msg);

    socket.on('chat msg', (msg) => {
        console.log("socket.on");
        console.log(msg.sender);
        console.log(msg.receiver);
        console.log(msg.text);
        console.log(msg);
        const receiverSocket = userSocketMap[msg.receiver];
        if(receiverSocket) {
            console.log("Message Emitted");
            receiverSocket.emit('chat msg', msg);
        }
        addMsgToConversation([msg.sender, msg.receiver],
                  {
                    text: msg.text,
                    sender:msg.sender,
                    receiver:msg.receiver
                  })
    });
  });


dotenv.config();
const port = process.env.PORT || 5000;

// Define a route
app.get("/", (req, res) => {
  res.send("Congratulations HHLD Folks!");
});

app.use('/msgs', msgsRouter);

// Start the server
server.listen(port, () => {
  connectToMongoDB();
  console.log(`Server is listening at http://localhost:${port}`);
});
