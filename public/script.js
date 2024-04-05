// Initiate socket
const socket = io('/')
const delay = ms => new Promise(res => setTimeout(res, ms)); //for timeout 

// Upon receiving connect signal from server emit the username to store in socket metadate
socket.on('connect', () => {
  socket.emit('get-username', USERNAME); // USERNAME is received from prompt in room.ejs
});

// Video and Chat grid HTML div
const videoGrid = document.getElementById('video-grid')
const chatGrid = document.getElementById('chat-grid')

// Creating own Peer server
const myPeer = new Peer({
    port:'3001',
    host:'/'
})

myPeer.on('open', id => {
    console.log("ROOM_ID, peer_id",ROOM_ID, id)
    socket.emit('join-room', ROOM_ID, id)
})

let myVideo = document.createElement('video') // Video element to put my stream
let peers = {} // A object to store {userID:call}. Will use the call object to close the peer connection
let peerIds =[] // Store the peerID of every user in the room

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
    }).then(stream => {
    
    addVideoStream(myVideo, USERNAME, stream) // To store the stream in the video element.
  
    // When new user connects to the room, make a peer call and display the stream.
    socket.on('user-connected', (userId,username) => {
        console.log("user connected",username)
        const call = myPeer.call(userId, stream, { metadata: {username: USERNAME } });

        peers[userId] = call // Store the call in peers object
        
        // Create a div to hold the video element and user name
        const videoBox = document.createElement('div');
        const video = document.createElement('video');
  
        // Handle incoming stream from the other user
        call.once('stream', userStream => {
            video.srcObject = userStream;
            video.autoplay = true;
            //video.muted = true;

            
            videoBox.className = 'videoBox';
            videoBox.innerHTML = `<p>${username}</p>`;
            videoBox.append(video);
            document.getElementById('video-grid').appendChild(videoBox);
        });
  
        call.on('close', () => {
            videoBox.remove()
        })
  
        // Handle call errors
        call.on('error', error => {
            console.error('Call error:', error);
        });
    })
  
    socket.on('user-disconnected', userId => {
        console.log("user disconnected")
        if (peers[userId]) peers[userId].close() // Upon Socket disconnect, Close Peer call => That will remove the video from the screen #Ln.57 
    })
}).catch(error => {
    console.error('Error accessing media devices:', error);
});

// When receiving a call, answer it.
myPeer.on('call', async call => {
    // navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    // .then(stream => {
        await delay(1000); // So that addVideoStream funtion can setup myVideo tag
        call.answer(myVideo.srcObject); // Answer with my stream.

        const video = document.createElement('video');
        // Create a div to hold the video element and user name
        const videoBox = document.createElement('div');

        // Once received the caller stream, place it in the screen
        call.once('stream', userStream => {
            video.srcObject = userStream;
            //video.muted=true;
            video.autoplay = true;
        
            videoBox.className = 'videoBox';
            videoBox.innerHTML = `<p>${call.metadata.username}</p>`;
            videoBox.append(video);
            document.getElementById('video-grid').appendChild(videoBox);
        });

        call.on('close', () => {
            videoBox.remove()
        })

        // Handle call errors
        call.on('error', error => {
            console.error('Call error:', error);
        });
    
})

// To display own video stream
function addVideoStream(video,username, stream) {
    video.srcObject = stream
    video.muted=true; // Mute own audio to avoid echo
    video.autoplay = true;

    // Create a div to hold the video element and user name
    const videoBox = document.createElement('div');
    videoBox.className = 'videoBox';
    videoBox.innerHTML = `<p>${username}</p>`;
    videoBox.append(video);
    document.getElementById('video-grid').appendChild(videoBox);
}

//-------------------------------Chat Box---------------------//

// onClick event handler for chat send
function sendMessage(){
    var chatInput= document.getElementById("chat-input")
    socket.emit('send-message', chatInput.value) // Send message to server to broadcast to every user
    chatInput.value=''
}

// Event from server
socket.on('new-chat', chatMessage =>{
    displayMessage(chatMessage)
})

function displayMessage(chatInput){
    const myChat = document.createElement('p')
    myChat.textContent=chatInput
    chatGrid.append(myChat)
}


//--------------------------Screen Share------------------------//

// PeerIDs from server
socket.once('screen-share-peers',peerIds=>{
    shareScreen(peerIds)
})

function shareScreen(peerIds) {
    // Request permission to capture the screen
    navigator.mediaDevices.getDisplayMedia({ video: true })
        .then(screenStream => {
            // Stream the captured screen to a peer
            const screenVideo = document.createElement('video');

            screenVideo.srcObject = screenStream
            screenVideo.muted=true;
            screenVideo.autoplay = true;

            peerIds.forEach((peerId)=>{
                const call = myPeer.call(peerIds[1], screenStream,{ metadata: {username: USERNAME+"'s Screen" } });
            })
        })
        .catch(error => {
            console.error('Error accessing screen:', error);
        });
}


//--------------------------Toggle Switches--------------------------//

function toggleVideo() {
    myVideo.srcObject.getVideoTracks()[0].enabled = !(myVideo.srcObject.getVideoTracks()[0].enabled);
}

function toggleAudio() {
    myVideo.srcObject.getAudioTracks()[0].enabled = !(myVideo.srcObject.getAudioTracks()[0].enabled);
}