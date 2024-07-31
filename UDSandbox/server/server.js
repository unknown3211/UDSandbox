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

const GRAVITY = -0.01;
const JUMP_STRENGTH = 0.2;
const UPDATE_INTERVAL = 1000 / 60;

app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);
    players[socket.id] = { x: 0, y: 0.5, z: 0, velocityY: 0 };

    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', { id: socket.id, position: players[socket.id] });

    socket.on('move', (movement) => {
        if (players[socket.id]) {
            players[socket.id].x += movement.x;
            players[socket.id].z += movement.z;

            io.emit('playerMoved', { id: socket.id, position: players[socket.id] });
        }
    });

    socket.on('jump', () => {
        if (players[socket.id] && players[socket.id].y <= 0.5) {
            players[socket.id].velocityY = JUMP_STRENGTH;
        }
    });

    socket.on('disconnect', () => {
        console.log(`Connection closed: ${socket.id}`);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

setInterval(() => {
    for (let id in players) {
        if (players.hasOwnProperty(id)) {
            let player = players[id];
            
            player.velocityY += GRAVITY;
            player.y += player.velocityY;

            if (player.y < 0.3) {
                player.y = 0.3;
                player.velocityY = 0;
            }

            if (Math.abs(player.velocityY) > 0.01) {
                io.emit('playerMoved', { id: id, position: player });
            }
        }
    }
}, UPDATE_INTERVAL);

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
