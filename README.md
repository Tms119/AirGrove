# 🍃 AirGrove

A zero-cloud, peer-to-peer file and clipboard sharing app built with pure web technologies and styled after the Apple Dynamic Island.

Think of AirDrop, but without needing Apple hardware, Bluetooth, or downloading any apps. You open the website, pick a file or paste a quick note, point your phone at the Living Tree QR code, and your data streams straight to your other device over an encrypted direct connection. Zero middleman servers. Zero cloud storage. Pure direct transfer.

## 🚀 How to Use It

### Sending a File
1. Open AirGrove in your browser on your computer or phone.
2. Drop any file onto the window, click the upload box to browse, or paste an image directly from your clipboard.
3. A Living Tree QR code appears on your screen instantly.
4. On your second device, open your camera app and scan the QR code.
5. The two devices pair automatically, the Dynamic Island shifts into streaming mode, and your file streams straight to the receiving device.
6. Once it reaches 100 percent, tap Save File on the receiving screen.

### Sending a Quick Note or Link
1. Type or paste your text into the quick note bar at the bottom and press Enter.
2. Scan the QR code with your second device.
3. The note shows up on the receiver screen and copies to the clipboard automatically. If the note is a website link, you can tap Open Link to jump right to it.

### Sending More Files While Connected
1. After your first transfer finishes, the connection stays warm.
2. Drop another file or type another note on your sending device.
3. It sends immediately across the existing connection without needing to rescan the QR code.

## ✨ Features

- Dynamic Island UI: Fluid morphing island that squishes, expands, and changes colors based on your transfer status (idle, QR ready, turbo streaming, and completed).
- Aura Orbit Activity Ring: Real-time circular progress gauge with live transfer speeds in MB/s and accurate time remaining estimates.
- Turbo Chunk Streaming: Slices heavy files into binary packets, pushes them over WebRTC DataChannels, and uses buffer drain flow control to prevent browser memory spikes.
- Smart Two-Way Handshake: Both devices talk to each other before any byte is sent, verifying metadata and acknowledging completion so you never get stuck with corrupted 0KB files.
- Missing Chunk Retransmission: If packets drop over unstable connections, the receiver asks specifically for the missing chunks before finishing up.
- Living Tree QR Renderer: Custom canvas-based QR engine that pre-warms your peer connection on initial page load, rendering the QR code with zero wait time.
- Instant Clipboard Sync: Notes and URLs copy to the receiver clipboard automatically with a clean pill badge confirming the copy.
- Tactile Sound Chimes: Synthesizer chimes built with the Web Audio API for connection, transfer progress, and success events.
- Absolute Privacy: Files and notes never touch any third-party storage or database. It is pure browser-to-browser encryption.

## 🛠️ Languages, Libraries, and Frameworks

- HTML5: Semantic structure using native drag-and-drop zones, audio contexts, and responsive layouts.
- Vanilla CSS3: Pure modern CSS without Tailwind or bulky frameworks. Features glassmorphism, CSS variables, cubic-bezier spring curves, and conic gradients.
- Vanilla JavaScript (ES6+): Pure vanilla JavaScript utilizing async/await, ArrayBuffers, Blobs, DataViews, and TypedArrays for binary packet handling.
- WebRTC (Web Real-Time Communication): The core browser-to-browser protocol powering encrypted direct data channels between devices.
- PeerJS: Open-source client library handling WebRTC signaling and peer discovery.
- Web Audio API: Browser synthesizer creating organic chimes on the fly without loading external sound files.
- HTML5 Canvas API: High-DPI canvas rendering for both the custom Living Tree QR pattern and the Aura Orbit ring.
- Screen Wake Lock API: Prevents mobile screens from going to sleep while large files are actively transferring.

## 💻 Running Locally

You can run AirGrove locally with any static web server:

```bash
# Using Python
python3 -m http.server 3000

# Using Node.js
npx serve .
```

Open http://localhost:3000 on your computer, or open your local network address on your phone to test it.

