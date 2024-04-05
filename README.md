# ScreenShare

This is a web-based video conferencing platform built using `Node.js, PeerJS, and Socket.IO`. It enables users to conduct group video calls, share screens, and communicate with each other in real-time, providing a seamless virtual meeting experience.

### Features
- **Group Video Calls:** Conduct video calls with multiple participants simultaneously, allowing for effective collaboration and communication.
- **Screen Sharing**: Share your screen with other participants during a call, enabling presentations, demonstrations, and collaborative work.
- **Real-time Communication**: Communicate with other participants in real-time through audio, video, and text chat, fostering productive discussions.
- **User Name Display:** Display user names of participants in the call, enhancing user identification and interaction.
- **Audio and Video Muting:** Mute audio and video streams, with changes reflected across all users in the call.

### Technologies Used
- **Node.js:** Backend framework for server-side development.
- **PeerJS:** WebRTC library for peer-to-peer communication, enabling video calls and screen sharing.
- **Socket.IO:** Real-time bidirectional event-based communication between clients and the server.
- **HTML/CSS/JavaScript:** (***Very Basic***)Frontend technologies for building the user interface and client-side functionality.

### Installation
- Clone the repository:

```bash
git clone https://github.com/your_username/zoom-call-clone.git 
```

- Install dependencies:

```bash
npm install
```

- Start the server:

```bash
npm start
```

Access the application at http://localhost:3000 in your web browser.

### Starting Your Own Peer Server
You can use default cloud Peer server by **replacing** line 15 of script.js as ```const myPeer = new Peer()```

To run your own Peer server, follow these steps:

- Install the Peer server package globally:
```bash
npm install -g peer
```

- Start the Peer server:

```bash
peerjs --port 3001 --path /
```

### Usage
- Enter your name when prompted to join the call.
- Start or join a group call.
- Share your screen if needed.
- Interact with other participants through audio, video, and text chat.
- Audio and Video Muting. You can mute your audio or video during a call, and the changes will be reflected across all users in the call. 

