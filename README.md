# Peerwire

A minimal browser-based messenger. One person runs a relay server; everyone else connects to it by URL and messages by peer ID. No accounts, no persistence — messages exist only in transit.

## Using the client

Open `index.html` in a browser, enter the relay URL, and connect. Share your peer ID with whoever you want to message.

If someone sends you a link with `?relay=` in it (e.g. `index.html?relay=wss://example.com`), the client connects automatically.

## Running your own relay

Requires Node.js 18+.

```bash
cd src/p2p-messenger
npm install
node server.js       # default port 8765, override with PORT env var
```

Deploy to any Node.js host to get a public `wss://` URL.
