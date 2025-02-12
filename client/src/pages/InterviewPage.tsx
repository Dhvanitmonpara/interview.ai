import CodeEditor from "@/components/general/CodeEditor";
import Timer from "@/components/interview/Timer";
import Webcam from "@/components/interview/Webcam";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import useSocket from "@/socket/useSocket";
import useInterviewStore from "@/store/interviewStore";
import useSocketStore from "@/store/socketStore";
import { QuestionAnswerType, RoundType } from "@/types/InterviewData";
import { generateNextQuestion } from "@/utils/handleQuestionAnswer";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const selectRound = (questionIndex: number): RoundType => {
  if (questionIndex >= 0 && questionIndex <= 2) return "aptitude"
  if (questionIndex >= 3 && questionIndex <= 5) return "behavioral"
  if (questionIndex >= 6 && questionIndex <= 8) return "technical"
  return "system-design"
}

function InterviewPage() {

  const socket = useSocket()
  const { setSocketId } = useSocketStore()
  const { candidate } = useInterviewStore()

  const [emotionalState, setEmotionalState] = useState('undetermined');
  const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState<QuestionAnswerType | null>(null);

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

  const getNextQuestion = useCallback(async (transcribedText: string) => {
    if (!candidate) return
    const data = {
      yearsOfExperience: candidate.yearsOfExperience,
      candidateName: candidate.name,
      jobRole: candidate.jobRole,
      skills: candidate.skills,
      round: "screening" as RoundType,
      previousAnswer: transcribedText
    }
    const text = await generateNextQuestion(data)
    if (!text) {
      toast({ title: "Something went wrong while generating question" })
      return
    }
    return text
  }, [candidate])

  const handleResetQuestion = async () => {
    const transcribedText = await handleVideoTranscription();
    if (!transcribedText) {
      toast({ title: "Something went wrong while processing video" })
      return;
    }

    const text = await getNextQuestion(transcribedText);
    if (!text) {
      toast({ title: "Something went wrong while generating question" })
      return
    }

    const nextQUestionIndex = (currentQuestionAnswer && currentQuestionAnswer.index + 1) || 1
    const round = selectRound(nextQUestionIndex)

    setCurrentQuestionAnswer({ question: text, answer: "", round, index: nextQUestionIndex });
    socket.emit("next-question", { question: text, round });
  }

  const handleEmotionalStateChange = (newState: string) => {
    if (newState !== emotionalState) {
      setEmotionalState(newState);
    }
  };

  useEffect(() => {
    const initialSetup = async () => {
      if (!currentQuestionAnswer && candidate) {
        const text = await getNextQuestion("")
        if (!text) {
          return
        }
        setCurrentQuestionAnswer({ question: text, answer: "", round: "aptitude", index: 1 })
        socket.emit("initial-setup", candidate)
      }
    }

    initialSetup()
  }, [candidate, currentQuestionAnswer, getNextQuestion, socket])

  useEffect(() => {

    if (!candidate) {
      navigate("/dashboard")
      return;
    }

    const handleConnect = () => {
      setSocketId(socket.id || "");
    };

    const handleNextQuestion = ({ question, round }: { question: string, round: RoundType }) => {
      setCurrentQuestionAnswer({ question, answer: "", round, index: currentQuestionAnswer ? currentQuestionAnswer.index + 1 : 1 });
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
  }, [candidate, currentQuestionAnswer, navigate, setSocketId, socket]);

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-zinc-300 dark:border-zinc-700 px-24 h-16">
        <h3>Interview Analysis</h3>
        <div className="flex space-x-2 items-center">
          <Timer currentQuestionAnswer={currentQuestionAnswer} onReset={handleResetQuestion} />
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
          <Webcam onEmotionalStateChange={handleEmotionalStateChange} />
          <div className="h-full w-full bg-red-500">
            {/* avatar */}
            <p className="p-4">{currentQuestionAnswer?.question}</p>
          </div>
          {/* <div className="mt-4 px-4 text-xl">
            Current detected state: <strong>{emotionalState}</strong>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default InterviewPage;
