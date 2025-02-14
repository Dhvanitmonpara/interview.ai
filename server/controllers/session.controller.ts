import { Response, Request } from "express";
import { runningInterviewSession } from "../src/app";

const createSession = async (req: Request, res: Response) => {
  const { role, duration } = req.body;

  try {
    res.status(200).json({
      success: true,
      data: {},
      message: "Feedback sent successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: "Failed to send feedback due to server error",
        error: error.message,
      });
    } else {
      console.error("Error in sendFeedback:", error);
    }
  }
};

const updateSession = async (req: Request, res: Response) => {
  //
};

const getSession = async (req: Request, res: Response) => {
  //
};

const deleteSession = async (req: Request, res: Response) => {
  //
};

const getAllSessions = async (req: Request, res: Response) => {
  //
};

// API to fetch interview data after completion
const getSessionData = async (req: Request, res: Response) => {
  const { socketId } = req.params;

  if (!socketId) {
    res.status(400).json({ error: "Socket ID is required" });
  }

  if (runningInterviewSession.has(socketId)) {
    res.json(runningInterviewSession.get(socketId));
  }

  res.status(404).json({ error: "Interview data not found" });
};

export {
  createSession,
  updateSession,
  deleteSession,
  getSession,
  getSessionData,
  getAllSessions,
};
