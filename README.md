# Peerwire

A minimal P2P desktop messenger. One person hosts a relay; everyone connects to it by URL and messages by peer ID. No accounts, no persistence — messages exist only in transit.

## Download

Grab the latest installer from [Releases](https://github.com/nGubbins/peerwire/releases):

- **Windows** — `.exe` installer
- **macOS** — `.dmg`
- **Linux** — `.AppImage`

## Messaging a friend over the internet

The app starts a relay server on your machine automatically, but it's only reachable locally by default. To connect with someone over the internet, one of you needs to expose their relay publicly using [ngrok](https://ngrok.com).

**Whoever is hosting (one-time setup):**

1. Install ngrok: `winget install ngrok.ngrok` (Windows) or download from ngrok.com
2. Open Peerwire — the relay starts on port 8765
3. In a terminal, run: `ngrok tcp 8765`
4. Copy the address ngrok gives you, e.g. `tcp://0.tcp.ngrok.io:12345`
5. Change `tcp://` to `ws://` and share it: `ws://0.tcp.ngrok.io:12345`

**Your friend:**

1. Open Peerwire
2. Change the relay URL to the `ws://` address you shared
3. Register a peer ID and message away

Your peer IDs are shown in the app — share yours with anyone you want to reach.

## Run from source

```bash
npm install
npm start
```

## Host a standalone relay

To run just the relay server (e.g. on a VPS):

```bash
npm run relay   # listens on port 8765; override with PORT=9000 npm run relay
```

Then share the `ws://your-server-ip:8765` URL with anyone who wants to connect.
