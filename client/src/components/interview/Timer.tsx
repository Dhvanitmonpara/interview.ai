import selectRoundAndTimeLimit from "@/utils/selectRoundAndTimeLimit";
import { useState, useEffect, useRef, useCallback } from "react";

function Timer({ onReset, currentQuestionIndex }: { onReset: () => void, currentQuestionIndex: number }) {
  // Use number for browser setInterval
  const [timer, setTimer] = useState(selectRoundAndTimeLimit(currentQuestionIndex).timeLimit);
  const intervalRef = useRef<number | null>(null);

  // Helper function to format time in mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  // Helper function to start or restart the timer
  const startTimer = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const timerLimit = selectRoundAndTimeLimit(currentQuestionIndex).timeLimit;
    setTimer(timerLimit);

    // Create a new interval that decrements the timer every second
    intervalRef.current = window.setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          // Once the timer reaches 0, clear the interval
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return 0;
        }
      });
    }, 1000);
  }, [currentQuestionIndex]);

  // Restart the timer when the current question index changes
  useEffect(() => {
    startTimer();
  }, [currentQuestionIndex, startTimer]);

  // Trigger the reset callback when the timer hits 0.
  useEffect(() => {
    if (timer === 0) {
      onReset();
    }
  }, [timer, onReset]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <span className="text-zinc-800 dark:text-zinc-200 font-semibold px-4 py-2 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-md text-center">
      {formatTime(timer)}
    </span>
  );
}

export default Timer;
