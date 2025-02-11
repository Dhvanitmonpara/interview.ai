import Timer from "@/components/interview/Timer";
import Webcam from "@/components/interview/Webcam";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import useSocket from "@/socket/useSocket";
import useInterviewStore from "@/store/interviewStore";
import useSocketStore from "@/store/socketStore";
import { QuestionAnswerType, RoundType } from "@/types/InterviewData";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const mockQuestion = {
  question: "What is the output of console.log(\"2 + 2\")?",
  answer: "2 + 2",
  round: "aptitude" as RoundType
}

function InterviewPage() {

  const socket = useSocket()
  const { setSocketId } = useSocketStore()
  const { candidate } = useInterviewStore()

  const [emotionalState, setEmotionalState] = useState('undetermined');
  const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState<QuestionAnswerType | null>(mockQuestion);

  const navigate = useNavigate()

  const handleVideoTranscription = async () => {
    try {
      // TODO: Convert video into text and return it
      return "";
    } catch (error) {
      if (error instanceof Error) {
        toast({ title: error.message })
      } else {
        toast({ title: "Something went wrong while processing video" })
        console.log(error)
      }
      return null;
    }
  }

  const sendAnswerForEvaluation = useCallback(async () => {
    const transcribedText = await handleVideoTranscription();

    if (!transcribedText) {
      toast({ title: "Something went wrong while processing video" })
      return;
    }

    // TODO: update this to send more data
    const collectedData = {
      transcribedText,
      round: currentQuestionAnswer?.round,
      question: currentQuestionAnswer?.question,
      answer: currentQuestionAnswer?.answer
    }

    socket.emit("interview-answer", collectedData);
  }, [currentQuestionAnswer?.answer, currentQuestionAnswer?.question, currentQuestionAnswer?.round, socket])

  const handleResetQuestion = async () => {
    await sendAnswerForEvaluation();
  }

  const handleEmotionalStateChange = (newState: string) => {
    if (newState !== emotionalState) {
      setEmotionalState(newState);
    }
  };

  useEffect(() => {
    if (!currentQuestionAnswer) {
      socket.emit("initial-setup", candidate)
    }
  }, [candidate, currentQuestionAnswer, sendAnswerForEvaluation, socket])

  useEffect(() => {

    if (!candidate) {
      navigate("/dashboard")
      return;
    }

    const handleConnect = () => {
      setSocketId(socket.id || "");
    };

    const handleNextQuestion = ({ question, round }: { question: string, round: RoundType }) => {
      setCurrentQuestionAnswer({ question, answer: "", round });
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
    socket.on("next-question", handleNextQuestion);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("next-question", handleNextQuestion);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [candidate, navigate, setSocketId, socket]);

  return (
    <div className="">
      <h3>Interview Analysis</h3>

      {/* Header */}
      <div className="flex space-x-2">
        <Timer currentQuestionAnswer={currentQuestionAnswer} onReset={handleResetQuestion} />
        <Button onClick={handleResetQuestion}>Skip time</Button>
        <Dialog>
          <DialogTrigger>
            <span className="bg-red-500 text-zinc-100 rounded-md py-3 px-4">Leave</span>
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

      {/* webcam */}
      <Webcam onEmotionalStateChange={handleEmotionalStateChange} />

      <div className="mt-4 px-4 text-xl">
        Current detected state: <strong>{emotionalState}</strong>
      </div>
    </div>
  );
}

export default InterviewPage;
