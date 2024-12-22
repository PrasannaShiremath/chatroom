const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const clients = new Map();

server.on('connection', (socket) => {
  console.log('A new client connected.');

  // Handle messages
  socket.on('message', (data) => {
    const message = JSON.parse(data);
    console.log('Received:', message);

    // Broadcast to all clients
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });

  socket.on('close', () => console.log('A client disconnected.'));
});

console.log('WebSocket server running on ws://localhost:8080');
