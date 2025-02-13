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
    // Initial interview data for the session
    const initialInterviewData = {
        userId: socket.id, // Using socket ID for tracking
        responses: [],
        startTime: Date.now(),
        endTime: null,
        faceExpressions: []
    };

    // Notify everyone that a user has connected
    io.emit('user-connected', { socketId: socket.id });

    // initial setup
    socket.on("initial-setup", (data) => {
        runningInterviewSession.set(socket.id, { ...initialInterviewData, ...data });
    })

    // face expression data
    socket.on("face-expression-data", ({ expressionState, timeStamp, questionAnswerIndex }) => {
        if (runningInterviewSession.has(socket.id)) {
            runningInterviewSession.get(socket.id).responses[questionAnswerIndex].faceExpressions.push(expressionState, timeStamp)
        }
    })

    // previous question data
    socket.on("previous-question-data", (data) => {
        if (runningInterviewSession.has(socket.id)) {
            runningInterviewSession.get(socket.id).responses.push(data)
        }
    })

    // Handle interview completion
    socket.on("interview-complete", () => {
        if (runningInterviewSession.has(socket.id)) {
            runningInterviewSession.get(socket.id).endTime = Date.now();

            // TODO: process analytics data

            socket.emit("interview-analytics", true)
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        runningInterviewSession.delete(socket.id);
    });
});

//routes import
import sessionRouter from "./routes/session.routes.js"

//routes declaration
app.use("/api/v1/sessions", sessionRouter)

// http://localhost:8000/api/v1/users/register

export { app, server, runningInterviewSession }