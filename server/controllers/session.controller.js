import { runningInterviewSession } from "../app.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const createSession = asyncHandler(async (req, res) => {

  const { role, duration } = req.body

  try {

    return res.status(200).json({
      success: true,
      messageId: mailResponse.messageId,
      message: "Feedback sent successfully"
    });
  } catch (error) {
    console.error("Error in sendFeedback:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send feedback due to server error",
      error: error.message
    });
  }
})

const updateSession = asyncHandler(async (req, res) => {
  //  
})

const getSession = asyncHandler(async (req, res) => {
  // 
})

const deleteSession = asyncHandler(async (req, res) => {
  // 
})

const getAllSessions = asyncHandler(async (req, res) => {
  //
})

// API to fetch interview data after completion
const getSessionData = asyncHandler(async (req, res) => {
  const { socketId } = req.params;

  if (!socketId) {
    return res.status(400).json({ error: 'Socket ID is required' });
  }

  if (runningInterviewSession.has(socketId)) {
    return res.json(runningInterviewSession.get(socketId));
  }

  res.status(404).json({ error: 'Interview data not found' });
});

export { createSession, updateSession, deleteSession, getSession, getSessionData, getAllSessions }