import Webcam from "@/components/interview/Webcam";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function InterviewPage() {

  const [emotionalState, setEmotionalState] = useState('undetermined');

  const navigate = useNavigate()

  const handleEmotionalStateChange = (newState: string) => {
    if (newState !== emotionalState) {
      setEmotionalState(newState);
    }
  };

  return (
    <div className="">
      <h3>Interview Analysis</h3>
      <div className="flex space-x-2">
        <Button>Skip time</Button>
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
      <Webcam onEmotionalStateChange={handleEmotionalStateChange} />
      <div className="mt-4 px-4 text-xl">
        Current detected state: <strong>{emotionalState}</strong>
      </div>
    </div>
  );
}

export default InterviewPage;
