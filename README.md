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

1. Open Peerwire — it starts connected to their own localhost by default
2. In the **relay server** bar at the top, clear the URL and paste the `ws://` address you shared
3. Click **connect**
4. Share peer IDs (shown at the top of the app) and start messaging

## Messaging on the same network (no ngrok needed)

If you're on the same WiFi, skip ngrok entirely:

1. Find your local IP: run `ipconfig` (Windows) or `ifconfig` (Mac/Linux) and look for your IPv4 address, e.g. `192.168.1.42`
2. Share `ws://192.168.1.42:8765` with your friend
3. Your friend pastes it into the relay server bar and clicks **connect**

You may need to allow port 8765 through your firewall.

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
