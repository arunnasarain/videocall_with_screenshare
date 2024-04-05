const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid') // For room ID

app.set('view engine', 'ejs') // To render ejs file 
app.use(express.static('public'))

// When there is no roomid in the URL, that means new room is to be created
// Will create a new uuid and append it with the url and redirect to /:roomID
app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`) 
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

// Every new socket connection
io.on('connection', socket => {
    socket.metadata = { // Initialize with empty string
        username: '', 
        roomId: '',   
        peerId: '',
    };

    // Store the username in metadata
    socket.on('get-username',(username)=>{
        socket.metadata.username=username
        console.log("socketconnected line 23",socket.metadata.username)
    })

    // Return all peerIDS in the room
    socket.on('screenshare',(roomId)=>{
        let activeConnections=[]

        let room =io.sockets.adapter.rooms.get(roomId) // Get all socketID

        if (room){
            activeConnections = Array.from(room); // Typecast set iterator to Array
        }

        let peerIDS=[]

        activeConnections.forEach((socketId)=>{
            let targetSocket = io.sockets.sockets.get(socketId);
            peerIDS.push(targetSocket.metadata.peerId)
            
        })

        socket.emit('screen-share-peers',peerIDS)
    })


    socket.on('join-room', (roomId, userId) => {
        socket.metadata.roomId=roomId
        socket.metadata.peerId=userId

        socket.join(roomId)
        socket.to(roomId).emit('new-chat', `${socket.metadata.username} joined the room`) // Add a Chat
        socket.to(roomId).emit('user-connected', userId,socket.metadata.username)

        socket.on('disconnect', () => {
            console.log("user disconnected")
            socket.to(roomId).emit('user-disconnected', userId)
        })

        // Send message to every user in chatbox including self. So using io.to instead of socket.to
        socket.on('send-message', (message) => {
            console.log("sendMessage roomId",roomId,socket.metadata.username)
            io.to(roomId).emit('new-chat', (socket.metadata.username) + ": " + message);
        });
  })
})

server.listen(3000)