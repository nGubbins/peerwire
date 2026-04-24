const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { WebSocket } = require('ws');
const { start } = require('../src/p2p-messenger/server.js');

let server;
let port;

function connect() {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://localhost:${port}`);
    ws.once('open', () => resolve(ws));
    ws.once('error', reject);
  });
}

function nextMsg(ws) {
  return new Promise((resolve, reject) => {
    ws.once('message', (data) => {
      try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
    });
    ws.once('error', reject);
  });
}

async function register(ws, id) {
  const p = nextMsg(ws);
  ws.send(JSON.stringify({ type: 'register', id }));
  return p;
}

before(() => new Promise(resolve => {
  server = start(0);
  server.once('listening', () => { port = server.address().port; resolve(); });
}));

after(() => new Promise(resolve => server.close(resolve)));

test('register returns registered with sanitized ID', async () => {
  const ws = await connect();
  const resp = await register(ws, 'alice');
  assert.equal(resp.type, 'registered');
  assert.equal(resp.id, 'ALICE');
  ws.close();
});

test('ID sanitization: uppercase, strip non-alphanumeric-dash, cap at 20 chars', async () => {
  const ws = await connect();
  const resp = await register(ws, 'hello world! 123-abc##extra-padding-here');
  assert.equal(resp.type, 'registered');
  assert.equal(resp.id, 'HELLOWORLD123-ABCEXT');
  assert.equal(resp.id.length, 20);
  ws.close();
});

test('empty ID after sanitization is rejected (no registered response)', async () => {
  const ws = await connect();
  let received = false;
  ws.on('message', () => { received = true; });
  ws.send(JSON.stringify({ type: 'register', id: '!@#$%' }));
  await new Promise(r => setTimeout(r, 80));
  assert.equal(received, false);
  ws.close();
});

test('message forwarding: sender A reaches receiver B', async () => {
  const [wa, wb] = await Promise.all([connect(), connect()]);
  await register(wa, 'PEER-A');
  await register(wb, 'PEER-B');
  const incoming = nextMsg(wb);
  wa.send(JSON.stringify({ type: 'message', to: 'PEER-B', text: 'hello', part: 1, parts: 1, stamp: 1000 }));
  const msg = await incoming;
  assert.equal(msg.type, 'message');
  assert.equal(msg.from, 'PEER-A');
  assert.equal(msg.text, 'hello');
  assert.equal(msg.stamp, 1000);
  wa.close(); wb.close();
});

test('message to offline peer returns error/offline', async () => {
  const ws = await connect();
  await register(ws, 'SENDER-X');
  const p = nextMsg(ws);
  ws.send(JSON.stringify({ type: 'message', to: 'NOBODY', text: 'hi', part: 1, parts: 1, stamp: 0 }));
  const resp = await p;
  assert.equal(resp.type, 'error');
  assert.equal(resp.code, 'offline');
  assert.equal(resp.to, 'NOBODY');
  ws.close();
});

test('ping returns pong with correct online status', async () => {
  const [wa, wb] = await Promise.all([connect(), connect()]);
  await register(wb, 'PINGABLE');

  const p1 = nextMsg(wa);
  wa.send(JSON.stringify({ type: 'ping', to: 'PINGABLE' }));
  const r1 = await p1;
  assert.equal(r1.type, 'pong');
  assert.equal(r1.online, true);

  wb.close();
  await new Promise(r => setTimeout(r, 60));

  const p2 = nextMsg(wa);
  wa.send(JSON.stringify({ type: 'ping', to: 'PINGABLE' }));
  const r2 = await p2;
  assert.equal(r2.type, 'pong');
  assert.equal(r2.online, false);

  wa.close();
});

test('unregistered client cannot relay messages', async () => {
  const ws = await connect();
  let received = false;
  ws.on('message', () => { received = true; });
  ws.send(JSON.stringify({ type: 'message', to: 'ANYONE', text: 'ghost', part: 1, parts: 1, stamp: 0 }));
  await new Promise(r => setTimeout(r, 80));
  assert.equal(received, false);
  ws.close();
});

test('message text is capped at 4000 chars', async () => {
  const [wa, wb] = await Promise.all([connect(), connect()]);
  await register(wa, 'LONG-SENDER');
  await register(wb, 'LONG-RECV');
  const incoming = nextMsg(wb);
  wa.send(JSON.stringify({ type: 'message', to: 'LONG-RECV', text: 'x'.repeat(5000), part: 1, parts: 1, stamp: 0 }));
  const msg = await incoming;
  assert.equal(msg.text.length, 4000);
  wa.close(); wb.close();
});

test('invalid JSON is silently dropped', async () => {
  const ws = await connect();
  await register(ws, 'VALID-PEER');
  let extra = 0;
  ws.on('message', () => extra++);
  ws.send('not json at all');
  await new Promise(r => setTimeout(r, 60));
  assert.equal(extra, 0);
  ws.close();
});
