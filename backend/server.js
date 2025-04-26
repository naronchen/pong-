import express from 'express';
import { nanoid } from 'nanoid';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Map to hold rooms in memory
const rooms = new Map();

app.get('/', (req, res) => {
    res.send(`🏓 Pong backend is alive!`);
});

app.listen(PORT, () => {
    console.log(`🚀 sever listening on localhost${PORT}`);
})

app.post('/api/rooms', (req, res) => {
    const roomId = nanoid(6);
    rooms.set(roomId, { players: [] })
    const joinUrl = `${req.get('origin')}/join/${roomId}`;
    res.json({ roomId, joinUrl });
})