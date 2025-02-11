import { QuestionAnswerType } from "@/types/QuestionAnswer";
import { useState, useEffect, useRef } from "react";

function Timer({ onReset, currentQuestionAnswer }: { onReset: () => void, currentQuestionAnswer: QuestionAnswerType | null }) {
  const [timer, setTimer] = useState(60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to start or restart the timer
  const startTimer = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Reset timer to 60 seconds
    setTimer(60);
    // Create a new interval that decrements the timer every second
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          // Once the timer reaches 0, clear the interval
          clearInterval(intervalRef.current!);
          return 0;
        }
      });
    }, 1000);
  };

  // When the currentQuestionAnswer changes, restart the timer.
  useEffect(() => {
    if (currentQuestionAnswer) {
      startTimer();
    } else {
      // Optionally, if there's no current question, clear the timer.
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    // Cleanup on unmount or if currentQuestionAnswer changes again:
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentQuestionAnswer]);

  // Trigger the reset callback when the timer hits 0.
  useEffect(() => {
    if (timer === 0) {
      onReset();
    }
  }, [timer, onReset]);

  return (
    <div>
      <h1>Time Left: {timer < 10 ? `0${timer}` : timer}s</h1>
    </div>
  );
}

export default Timer;
