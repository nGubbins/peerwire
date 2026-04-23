/**
 * P2P Messenger - WebSocket Relay Server
 * Run with: node server.js
 * Requires Node.js 18+ (uses built-in WebSocket server via 'ws' package)
 */

const http = require('http');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8765;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('P2P Messenger relay running.\n');
});

const wss = new WebSocketServer({ server });

// Map of id -> websocket
const clients = new Map();

wss.on('connection', (ws) => {
  let myId = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    // REGISTER: client announces its ID
    if (msg.type === 'register') {
      const id = String(msg.id).toUpperCase().replace(/[^A-Z0-9\-]/g, '').slice(0, 20);
      if (!id) return;
      myId = id;
      clients.set(id, ws);
      ws.send(JSON.stringify({ type: 'registered', id }));
      console.log(`[+] ${id} connected (${clients.size} online)`);
      return;
    }

    // MESSAGE: forward to recipient by ID
    if (msg.type === 'message') {
      if (!myId) return;
      const toId = String(msg.to || '').toUpperCase().replace(/[^A-Z0-9\-]/g, '');
      const target = clients.get(toId);
      if (target && target.readyState === 1) {
        target.send(JSON.stringify({
          type: 'message',
          from: myId,
          text: String(msg.text || '').slice(0, 4000),
          part: msg.part,
          parts: msg.parts,
          stamp: msg.stamp
        }));
      } else {
        ws.send(JSON.stringify({ type: 'error', code: 'offline', to: toId }));
      }
      return;
    }

    // PING: check if a peer is online
    if (msg.type === 'ping') {
      const toId = String(msg.to || '').toUpperCase().replace(/[^A-Z0-9\-]/g, '');
      ws.send(JSON.stringify({ type: 'pong', to: toId, online: clients.has(toId) }));
      return;
    }
  });

  ws.on('close', () => {
    if (myId) {
      clients.delete(myId);
      console.log(`[-] ${myId} disconnected (${clients.size} online)`);
    }
  });

  ws.on('error', () => {});
});

server.listen(PORT, () => {
  console.log(`P2P Messenger relay listening on port ${PORT}`);
  console.log(`Share your IP address with friends so they can connect.`);
  console.log(`To find your IP: run 'ipconfig' (Windows) or 'ifconfig' (Mac/Linux)`);
});
