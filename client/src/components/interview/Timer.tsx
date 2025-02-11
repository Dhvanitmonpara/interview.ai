import { useState, useEffect } from "react";

function Timer({ onReset }: { onReset: () => void }) {
  const [timer, setTimer] = useState(10);

  useEffect(() => {

    if (timer === 0) {
      onReset();
    }

  }, [onReset, timer])

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div>
      <h1>Time Left: {timer}s</h1>
    </div>
  );
}

export default Timer;
