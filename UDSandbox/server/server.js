const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let players = {};

app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);
    players[socket.id] = { x: 0, y: 0.5, z: 0 };

    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', { id: socket.id, position: players[socket.id] });

    socket.on('move', (movement) => {
        if (players[socket.id]) {
            players[socket.id].x += movement.x;
            players[socket.id].y += movement.y;
            players[socket.id].z += movement.z;

            io.emit('playerMoved', { id: socket.id, position: players[socket.id] });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Connection closed: ${socket.id}`);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
