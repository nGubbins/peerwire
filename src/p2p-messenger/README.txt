P2P Messenger
=============

A simple peer-to-peer text messenger. Messages are routed through a
lightweight relay server — one person runs it, everyone else connects.


QUICK START
-----------

You need Node.js installed (https://nodejs.org — get the LTS version).


Step 1 — Install dependencies (one time only)
  Open a terminal in this folder and run:

    npm install


Step 2 — Start the relay server
  In the same terminal, run:

    node server.js

  You'll see: "P2P Messenger relay listening on port 8765"
  Leave this terminal open while chatting.


Step 3 — Open the messenger
  Open index.html in your browser (just double-click it).


Step 4 — Connect to the relay
  In the "relay server" bar at the top, enter the address:

  If you're on the same Wi-Fi as the server:
    ws://<server-computer-IP>:8765
    e.g.  ws://192.168.1.42:8765

  To find your IP address:
    Windows:  open Command Prompt, type: ipconfig
    Mac/Linux: open Terminal, type: ifconfig

  If you're connecting over the internet, you'll need to either:
    - Forward port 8765 on your router, then use your public IP
    - Or use a tunnelling service like ngrok (https://ngrok.com):
        ngrok http 8765   → use the wss://... address it gives you


Step 5 — Share your ID
  Your ID is shown at the top of the app. Share it with your contact.
  They paste it in "add contact", give it a nickname, and you're chatting.


HOW IT WORKS
------------
- Each user gets a unique ID when they open the app (timestamp + random)
- The relay server forwards messages between users by ID
- The server does NOT store messages — it only forwards them in real time
- If the recipient is offline, you'll see a "not delivered" notice
- Echo is a built-in bot that repeats everything you send (good for testing)


NOTES
-----
- Messages are not end-to-end encrypted in this version
- Long messages are automatically split into 160-character chunks
- Click any message bubble to see its exact timestamp
- The relay server only needs to run on one computer


FILES
-----
  index.html   — the messenger app (open this in your browser)
  server.js    — the relay server (run with: node server.js)
  package.json — Node.js dependencies
  README.txt   — this file
