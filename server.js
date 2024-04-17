const express = require('express'); // Importing the Express framework
const http = require('http'); // Importing the HTTP module
const socketIo = require('socket.io'); // Importing Socket.IO for real-time communication

const app = express(); // Creating an instance of Express
const server = http.createServer(app); // Creating an HTTP server using Express
const io = socketIo(server); // Creating a Socket.IO instance attached to the HTTP server

app.use(express.static('public')); // Serving static files from the 'public' directory

const users = {}; // Object to store connected users

// Event listener for new socket connections
io.on('connection', socket => {
    // Event listener for when a new user joins
    socket.on('new-user-joined', name => {
        users[socket.id] = name; // Storing the user's name with their socket ID
        socket.broadcast.emit('user-joined', name); // Broadcasting to all users except the sender that a new user has joined
    });

    // Event listener for when a user sends a message
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] }); // Broadcasting the message to all users except the sender
    });

    // Event listener for when a user disconnects
    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('user-left', users[socket.id]); // Broadcasting to all users except the sender that a user has left
            delete users[socket.id]; // Removing the user from the users object
        }
    });
});

const PORT = 8000; // Port number for the server to listen on
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Starting the server and logging the port it's running on
});
