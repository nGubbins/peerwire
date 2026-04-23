# Peerwire

A minimal P2P desktop messenger. One person hosts a relay; everyone connects to it by URL and messages by peer ID. No accounts, no persistence — messages exist only in transit.

## Install

Build a distributable and run the installer — no runtime required.

```bash
npm run build   # outputs to dist/
```

## Run from source

```bash
npm install
npm start
```

## Host a relay server

The app starts a local relay automatically. To message someone over the internet, deploy a public relay and share the `wss://` URL with whoever you want to reach.

```bash
npm run relay   # default port 8765, override with PORT env var
```
