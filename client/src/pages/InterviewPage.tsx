import Webcam from "@/components/interview/Webcam";
import { Button } from "@/components/ui/button";
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

  const leaveInterviewHandler = () => {
    navigate("/dashboard")
  }

  return (
    <div className="">
      <h3>Interview Analysis</h3>
      <div className="flex space-x-2">
        <Button>Skip time</Button>
        <Button variant="destructive" onClick={leaveInterviewHandler}>Leave</Button>
      </div>
      <Webcam onEmotionalStateChange={handleEmotionalStateChange} />
      <div className="mt-4 px-4 text-xl">
        Current detected state: <strong>{emotionalState}</strong>
      </div>
    </div>
  );
}

export default InterviewPage;
