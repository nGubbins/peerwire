# Peerwire

A minimal P2P desktop messenger. One person runs a relay server; everyone connects to it by URL and messages by peer ID. No accounts, no servers storing your data — messages exist only in transit.

## Download

Grab the latest installer from [Releases](https://github.com/nGubbins/peerwire/releases):

- **Windows** — `.exe` installer
- **macOS** — `.dmg`
- **Linux** — `.AppImage`

## How it works

When you open the app, it starts a relay server on your machine (`localhost:8765`) and connects to it automatically. To message someone, you both need to be connected to the **same** relay. Share your peer ID (shown at the top of the app) with whoever you want to reach.

## Same network (WiFi/LAN)

One person acts as the relay host. Everyone else connects to their machine:

1. The host finds their local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux) — look for the IPv4 address, e.g. `192.168.1.42`
2. Everyone else opens the **relay server** bar at the top, replaces `localhost` with the host's IP (`ws://192.168.1.42:8765`), and clicks **connect**

The host may need to allow port 8765 through their firewall.

## Over the internet

You need a publicly reachable relay. The cleanest option is a VPS or any server you can SSH into:

```bash
npm install
npm run relay   # listens on port 8765
```

Share `ws://your-server-ip:8765` (or `ws://relay.yourdomain.com:8765`) as the relay URL. Friends paste it into the relay server bar and click connect.

For a quick test without a server, [ngrok](https://ngrok.com) can temporarily expose your local relay:

```bash
ngrok tcp 8765
# gives you something like tcp://0.tcp.ngrok.io:12345
# share as ws://0.tcp.ngrok.io:12345
```

Requires a free ngrok account.

## Run from source

```bash
npm install
npm start
```
