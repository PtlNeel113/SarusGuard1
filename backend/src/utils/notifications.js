const WebSocket = require('ws');

let wss;

const initWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
};

const broadcastNotification = (type, data) => {
  if (!wss) return;

  const message = JSON.stringify({ type, data, timestamp: new Date() });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

module.exports = { initWebSocket, broadcastNotification };
