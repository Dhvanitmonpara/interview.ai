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

const runningInterviewSession = new Map();

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Initial interview data for the session
    const initialInterviewData = {
        userId: socket.id, // Using socket ID for tracking
        responses: [],
        startTime: Date.now(),
        endTime: null,
    };

    // Store the session data
    runningInterviewSession.set(socket.id, initialInterviewData);

    // Notify everyone that a user has connected
    io.emit('user-connected', { socketId: socket.id });

    // Handle incoming interview data
    socket.on("interview-data", (data) => {
        if (runningInterviewSession.has(socket.id)) {
            runningInterviewSession.get(socket.id).responses.push(data);
            console.log(`Data received from ${socket.id}:`, data);
        }
    });

    // Handle interview completion
    socket.on("interview-complete", () => {
        if (runningInterviewSession.has(socket.id)) {
            runningInterviewSession.get(socket.id).endTime = Date.now();
            console.log(`Interview completed for ${socket.id}`);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);

        // Remove session data
        runningInterviewSession.delete(socket.id);

        // Notify all clients
        io.emit('user-disconnected', { socketId: socket.id });
    });
});

//routes import
import sessionRouter from "./routes/session.routes.js"

//routes declaration
app.use("/api/v1/sessions", sessionRouter)

// http://localhost:8000/api/v1/users/register

export { app, runningInterviewSession }