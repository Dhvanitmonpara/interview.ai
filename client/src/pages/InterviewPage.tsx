import CodeEditor from "@/components/general/CodeEditor";
import Timer from "@/components/interview/Timer";
import Webcam from "@/components/interview/Webcam";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAutoSpeechRecognizer } from "@/hooks/useAutoSpeechRecognizer";
import useSocket from "@/socket/useSocket";
import useInterviewStore from "@/store/interviewStore";
import useSocketStore from "@/store/socketStore";
import { generateNextQuestion } from "@/utils/handleQuestionAnswer";
import selectRoundAndTimeLimit from "@/utils/selectRoundAndTimeLimit";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function InterviewPage() {

  const socket = useSocket()
  const { setSocketId } = useSocketStore()
  const { candidate, questionAnswerSets, addQuestionAnswerSet, updateAnswer } = useInterviewStore()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [resettingQuestion, setResettingQuestion] = useState(false);

  const navigate = useNavigate()
  const { transcript } = useAutoSpeechRecognizer(currentQuestionIndex);

  // helper function for generating next question using gemini API
  const getNextQuestion = useCallback(async (transcribedText: string) => {
    if (!candidate) return;

    const roundAndTimeLimit = selectRoundAndTimeLimit(currentQuestionIndex + 1);

    const data = {
      yearsOfExperience: candidate.yearsOfExperience,
      candidateName: candidate.name,
      jobRole: candidate.jobRole,
      skills: candidate.skills,
      round: roundAndTimeLimit.round,
      timeLimit: roundAndTimeLimit.timeLimit,
      previousAnswer: transcribedText,
    };

    // Timeout after 10 seconds if API is slow
    const timeoutPromise = new Promise<string | null>((resolve) =>
      setTimeout(() => resolve(null), 10000)
    );

    const aiPromise = generateNextQuestion(data);

    const text = await Promise.race([aiPromise, timeoutPromise]); // Whichever finishes first

    if (!text) {
      console.warn("⏳ AI API Timed Out!");
      toast({ title: "AI took too long. Try again." });
      return null;
    }

    return text;
  }, [candidate, currentQuestionIndex]);

  // main function to reset the question
  const handleResetQuestion = async () => {

    if (!questionAnswerSets) return;

    // Block multiple resets
    if (resettingQuestion) return;
    setResettingQuestion(true);

    try {

      socket.emit("update-question-data", {
        questionAnswerIndex: currentQuestionIndex,
        answer: transcript,
      });

      console.log(transcript)

      updateAnswer(transcript, currentQuestionIndex);

      console.time("📌 Question Generation Time");
      const newGeneratedQuestion = await getNextQuestion(transcript);
      console.timeEnd("📌 Question Generation Time");

      if (!newGeneratedQuestion) {
        toast({ title: "Something went wrong while generating question" });
        return;
      }

      addQuestionAnswerSet({
        question: newGeneratedQuestion,
        answer: "",
        round: selectRoundAndTimeLimit(currentQuestionIndex + 1).round,
        timeLimit: selectRoundAndTimeLimit(currentQuestionIndex + 1).timeLimit,
      });

      setCurrentQuestionIndex((prev) => prev + 1);

      socket.emit("initialize-new-question", {
        question: newGeneratedQuestion,
        answer: "",
        timeLimit: selectRoundAndTimeLimit(currentQuestionIndex + 1).timeLimit,
        round: selectRoundAndTimeLimit(currentQuestionIndex + 1).round,
      });

    } finally {
      setResettingQuestion(false);
    }
  };

  // useEffect for initial setup
  useEffect(() => {
    const initialSetup = async () => {
      if (!questionAnswerSets && candidate) {
        const text = await getNextQuestion("")
        if (!text) {
          return
        }
        addQuestionAnswerSet({ question: text, answer: "", round: "aptitude", timeLimit: 60 });
        socket.emit("initial-setup", candidate)
        socket.emit("initialize-new-question", { question: text, round: "aptitude", timeLimit: 60 })
      }
    }
    initialSetup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addQuestionAnswerSet, candidate, getNextQuestion, socket])

  // socket event handlers
  useEffect(() => {

    if (!candidate) {
      navigate("/dashboard")
      return;
    }

    const handleConnect = () => {
      setSocketId(socket.id || "");
    };

    const handleInterviewAnalyticsData = () => {
      // TODO: redirect user to analytics page and show it
      // TODO: call API that will store all collected data in database
    }

    const handleDisconnect = () => {
      setSocketId("");
      toast({ title: "You have been disconnected" });
    };

    const handleConnectError = (error: unknown) => {
      if (error instanceof Error) {
        console.error("Connection Error:", error.message);
      } else {
        console.error("Connection Error:", error);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("interview-analytics", handleInterviewAnalyticsData);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("interview-analytics", handleInterviewAnalyticsData);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate, navigate, setSocketId]);

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-zinc-300 dark:border-zinc-700 px-24 h-16">
        <h3>Interview Analysis</h3>
        <div className="flex space-x-2 items-center">
          <Timer currentQuestionIndex={currentQuestionIndex} onReset={handleResetQuestion} />
          <Button variant="secondary" onClick={handleResetQuestion}>Skip time</Button>
          <Dialog>
            <DialogTrigger>
              <span className="bg-red-500 text-zinc-100 font-semibold rounded-md py-2 px-4">Leave</span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure to leave?</DialogTitle>
                <DialogDescription>
                  You are about to leave the interview. And your all data will be lost.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start">
                <Button type="button" variant="destructive" onClick={() => navigate("/dashboard")}>
                  Leave
                </Button>
                <DialogClose className="h-full flex justify-center items-center bg-zinc-200 cursor-pointer px-3 rounded-md" asChild>
                  <span className="text-zinc-900 text-sm">Close</span>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4 rounded-md grid grid-cols-7 gap-4">
        <CodeEditor />
        <div className="col-span-2">
          {/* webcam */}
          <Webcam questionAnswerIndex={currentQuestionIndex} />
          <div className="h-full w-full bg-red-500">
            {/* avatar */}
            <p className="p-4">{questionAnswerSets && questionAnswerSets[currentQuestionIndex]?.question || "No question found"}</p>
          </div>
          {/* <div className="mt-4 px-4 text-xl">
            Current detected state: <strong>{emotionalState}</strong>
          </div> */}
        </div>
      </div>
    </div >
  );
}

export default InterviewPage;