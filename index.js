const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 }); // Runs on port 8080
const clients = new Set(); // Store all connected clients

server.on('connection', (socket) => {
    console.log('New client connected');

    // Add the new client to the set
    clients.add(socket);

    // Listen for messages from clients
    socket.on('message', (data) => {
        console.log('Received:', data.toString()); // Log the message

        // Broadcast message to all clients
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    // Handle client disconnection
    socket.on('close', () => {
        clients.delete(socket);
        console.log('Client disconnected');
    });
});

console.log('WebSocket server running on ws://localhost:8080');
