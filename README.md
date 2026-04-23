# Peerwire

A minimal P2P messenger. One person runs the relay server; everyone connects to it by WebSocket URL and messages by peer ID.

## Run locally

```bash
cd src/p2p-messenger
npm install
node server.js       # listens on port 8765
```

Open `index.html` in a browser. No dev server needed.

## Deploy (Railway)

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
3. Railway detects Node.js and runs `npm start` automatically
4. Copy the generated URL (e.g. `peerwire.up.railway.app`)

## Share with a friend

Send them `index.html` with the relay URL as a query parameter:

```
index.html?relay=wss://peerwire.up.railway.app
```

They open the file, it auto-connects. You both share your peer IDs and start messaging.
