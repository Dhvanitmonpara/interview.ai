import http from 'http'
import express from "express"
import cors from "cors"
import { Server } from 'socket.io';

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ACCESS_CONTROL_ORIGIN, // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});
const corsOptions = {
    origin: process.env.ACCESS_CONTROL_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200
}

// cors middleware
app.use(cors(corsOptions))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.options('*', cors()); 

const onlineUsers = new Map();

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    onlineUsers.set(userId, socket);
    console.log(`User ${userId} connected`);

    io.emit('userConnected', { userId });

    sendPendingNotifications(userId);

    socket.on('disconnect', () => {
        onlineUsers.delete(userId); // Remove user from online list
        console.log(`User ${userId} disconnected`);

        io.emit('userDisconnected', { userId });
    });
});

async function sendPendingNotifications(userId) {
    const notifications = await getPendingNotificationsFromDB(userId);
    if (notifications.length > 0) {
        onlineUsers.get(userId).emit('pendingNotifications', notifications);
    }
}

//routes import
import sessionRouter from "./routes/session.routes.js"

//routes declaration
app.use("/api/v1/sessions", sessionRouter)

// http://localhost:8000/api/v1/users/register

export { app }