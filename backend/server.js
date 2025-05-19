const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
console.log('✅ WebSocket server running on ws://localhost:8080');

wss.on('connection', (ws) => {
  console.log('🔌 Client connected');

  const sendData = () => {
    const machines = ['Machine A', 'Machine B', 'Machine C'];
    const data = machines.map((id) => ({
      id,
      temperature: (20 + Math.random() * 20).toFixed(2),
      status: Math.random() > 0.8 ? 'FAULT' : 'OPERATIONAL',
      rpm: Math.floor(Math.random() * 5000),
    }));
    ws.send(JSON.stringify(data));
  };

  const interval = setInterval(sendData, 1000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('❌ Client disconnected');
  });
});
