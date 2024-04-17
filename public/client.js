// Establishing a socket connection to the server
const socket = io('http://localhost:8000');

// Getting references to DOM elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('msginput');
const messageContainer = document.querySelector('.container');

// Creating an audio element for notification sound
var audio = new Audio('sound.mp3');

// Function to append messages to the message container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('msg');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    // Playing notification sound for incoming messages
    if (position == 'left') {
        audio.play();
    }
}

// Event listener for form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    // Appending the sent message to the message container
    append(`You: ${message}`, 'right');
    // Emitting the 'send' event to the server with the message
    socket.emit('send', message);
    // Clearing the message input field after sending
    messageInput.value = '';
});

// Prompting the user to enter their name to join the chat
// Getting references to DOM elements
const usernameInput = document.getElementById('username');
const submitButton = document.getElementById('submit-username');

// Event listener for form submission
submitButton.addEventListener('click', () => {
    const username = usernameInput.value;
    // Emitting the 'new-user-joined' event to the server with the username
    socket.emit('new-user-joined', username);
});

// Event listener for when a new user joins the chat
socket.on('user-joined', name => {
    // Appending a message indicating a user has joined
    append(`${name} joined the chat`, 'right')
})

// Event listener for receiving messages from other users
socket.on('receive', data => {
    // Appending the received message to the message container
    append(`${data.name}: ${data.message}`, 'left')
})

// Event listener for when a user leaves the chat
socket.on('user-left', name => {
    // Appending a message indicating a user has left
    append(`${name} left the chat`, 'left')
})
