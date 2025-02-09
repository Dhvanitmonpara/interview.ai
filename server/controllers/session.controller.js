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

export { createSession, updateSession, deleteSession, getSession }