import express from 'express';
import { nanoid } from 'nanoid';
import http from 'http';
import { Server as IOServer } from 'socket.io';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Map to hold rooms in memory
const rooms = new Map();

app.get('/', (req, res) => {
    res.send(`🏓 Pong backend is alive!`);
});

// create a room with roomId and joinUrl
app.post('/api/rooms', (req, res) => {
    const roomId = nanoid(6);
    rooms.set(roomId, { players: [] })
    const joinUrl = `${req.get('origin')}/join/${roomId}`;
    res.json({ roomId, joinUrl });
})

// join a room with roomId
// @todo: when room is full, if the player is already in, what happens?
app.post('/api/rooms/:roomId', (req, res) => {
    const { roomId } = req.params;
    const { username } = req.body;
    const room = rooms.get(roomId);

    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }
    if (room.players.length >= 2) {
        return res.status(400).json({ error: 'Room is full' });
    }

    room.players.push(username);
    res.json({ roomId, players: room.players });
});

// Socket.io setup
const server = http.createServer(app);
const io = new IOServer(server, {
    cors: {
        origin: '*' // @todo: change in prod
    },
});

// handle socket connection
io.on('connection', socket => {
    console.log('🔌 backend socket connected:', socket.id);
})

io.on('disconecting', socket => {
    console.log('🚪 backend socket disconnected:', socket.id);
})

server.listen(PORT, () => {
    console.log(`🚀 sever listening on localhost ${PORT}`);
    }
);