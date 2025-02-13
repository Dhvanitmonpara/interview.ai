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
        endTime: null
    };

    // Notify user that they are connected
    socket.emit('user-connected', { socketId: socket.id });

    // Initial setup
    socket.on("initial-setup", (data) => {
        runningInterviewSession.set(socket.id, { ...initialInterviewData, ...data });
    });

    // Initialize new question
    socket.on("initialize-new-question", (data) => {
        if (runningInterviewSession.has(socket.id)) {
            const session = runningInterviewSession.get(socket.id);

            // Set endTime for the previous question (last entry in responses array)
            if (session.responses.length > 0) {
                session.responses[session.responses.length - 1].endTime = Date.now();
            }

            // Add new question
            const newQuestion = {
                question: data.question || "",
                answer: data.answer || "",
                timeLimit: data.timeLimit || 60,
                round: data.round || "aptitude",
                startTime: Date.now(),
                endTime: null,
                faceExpressions: [],
                gazeTracking: []
            };

            session.responses.push(newQuestion);

            // Update the session in runningInterviewSession
            runningInterviewSession.set(socket.id, session);
        }
    });

    // Update question data
    socket.on("update-question-data", (data) => {
        if (runningInterviewSession.has(socket.id)) {
            const session = runningInterviewSession.get(socket.id);

            // Validate that the questionAnswerIndex exists
            if (session.responses[data.questionAnswerIndex]) {
                session.responses[data.questionAnswerIndex] = {
                    ...session.responses[data.questionAnswerIndex],
                    ...data,
                };
            }
        }
    });

    // Store face expression data after every few seconds
    socket.on("face-expression-data", ({ expressionData, timeStamp, questionAnswerIndex }) => {
        if (runningInterviewSession.has(socket.id)) {
            const session = runningInterviewSession.get(socket.id);

            // Validate that the questionAnswerIndex exists
            if (session.responses[questionAnswerIndex]) {
                session.responses[questionAnswerIndex].faceExpressions.push({ timeStamp, ...expressionData });
            } else {
                console.warn(`Invalid question index: ${questionAnswerIndex} for socket: ${socket.id}`);
            }
        }
        console.log(runningInterviewSession);
    });

    // Store gaze tracking data after every few seconds
    socket.on("gaze-tracking-data", ({ gazeTracking, timeStamp, questionAnswerIndex }) => {
        if (runningInterviewSession.has(socket.id)) {
            const session = runningInterviewSession.get(socket.id);

            // Validate that the questionAnswerIndex exists
            if (session.responses[questionAnswerIndex]) {
                session.responses[questionAnswerIndex].gazeTracking.push({ timeStamp, ...gazeTracking });
            } else {
                console.warn(`Invalid question index: ${questionAnswerIndex} for socket: ${socket.id}`);
            }
        }
        console.log(runningInterviewSession);
    });

    // Handle interview completion
    socket.on("interview-complete", () => {
        if (runningInterviewSession.has(socket.id)) {
            runningInterviewSession.get(socket.id).endTime = Date.now();

            // TODO: process analytics data

            socket.emit("interview-analytics", true);
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