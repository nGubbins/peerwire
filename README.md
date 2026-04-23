# Peerwire

A minimal P2P desktop messenger. One person runs the relay server; everyone else connects to it by URL and messages by peer ID. No accounts, no persistence — messages exist only in transit.

## Run the app

Requires Node.js 18+.

```bash
npm install
npm start
```

## Run your own relay server

```bash
npm run relay    # default port 8765, override with PORT env var
```

Deploy the relay to any Node.js host to get a public `wss://` URL. Share that URL with whoever you want to message — they enter it in the app to connect.

## Build a distributable

```bash
npm run build
```

Produces platform-native installers in `dist/` (`.dmg` on Mac, `.exe` on Windows, `.AppImage` on Linux).
