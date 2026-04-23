# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Peerwire is a P2P messenger — a WebSocket relay server plus a single-file browser client. One person runs the relay; everyone else connects to it by WebSocket URL and messages by peer ID.

The actual code lives in `src/p2p-messenger/`. The Python scaffold at the repo root (virtual env, `requirements.txt`) is not currently used.

## Running the relay server

```bash
cd src/p2p-messenger
npm install          # first time only
node server.js       # listens on port 8765 by default
```

Then open `index.html` directly in a browser (no dev server needed).

Override the port: `PORT=9000 node server.js`

## Architecture

**`server.js`** — stateless relay only. Maintains a `Map<id, WebSocket>` of connected clients. Three message types: `register` (client claims an ID), `message` (forwarded by ID to recipient), `ping` (online check). Messages are never stored; if the recipient is offline an `error/offline` response is sent back to the sender. IDs are sanitised to `[A-Z0-9-]` max 20 chars on arrival.

**`index.html`** — self-contained single-file app (vanilla JS, no build step, no dependencies). All state lives in a single `S` object: `S.contacts`, `S.messages`, `S.active`, `S.tab`. Key functions:

- `connectWS()` — opens WebSocket, registers with server
- `doSend()` — splits long messages into 160-char chunks, sends each as a separate `message` frame, or routes to `doEchoReply()` for the built-in Echo bot
- `renderChatList()` / `renderChat()` / `renderContactsList()` — full re-renders (no virtual DOM)
- `showOverlay(html)` — modal system; one modal at a time, closed by Escape or clicking the backdrop

Peer IDs are generated client-side: `Date.now().toString(36).toUpperCase() + '-' + random`. The timestamp portion is decoded in `decodeIdTs()` to show when a contact first appeared.

Messages are not end-to-end encrypted. State is in-memory only — refreshing the page loses contacts and history.
