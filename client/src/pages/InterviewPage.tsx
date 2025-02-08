import Webcam from "@/components/interview/Webcam";
import { useState } from "react";

function InterviewPage() {

  const [emotionalState, setEmotionalState] = useState('undetermined');

  const handleEmotionalStateChange = (newState: string) => {
    if (newState !== emotionalState) {
      setEmotionalState(newState);
    }
  };


  return (
    <div className="">
      <h3>Interview Analysis</h3>
      <Webcam onEmotionalStateChange={handleEmotionalStateChange} />
      <div className="mt-4 px-4 text-xl">
        Current detected state: <strong>{emotionalState}</strong>
      </div>
    </div>
  );
}

export default InterviewPage;
