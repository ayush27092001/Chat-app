const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io'); 

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow your frontend origin
    methods: ["GET", "POST"] // Specify allowed HTTP methods
  }
});

// Socket.io connection event
io.on('connection', (socket) => {
  console.log("A user connected");

  // Listen for 'create-something' event from the client
  socket.on('create-something', (data, callback) => {
    const { name, message } = data; // Destructure the name and message
    console.log(`${name} sent a message: ${message}`);

    // Acknowledge the client
    callback();

    // Emit the 'foo' event back to all connected clients with name and message
    io.emit('foo', { name, message });
  });

  socket.on('disconnect', () => {
    console.log("A user disconnected");
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send("<h1>Hello world! Home Page</h1>");
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
