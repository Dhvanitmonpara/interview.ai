import { useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./AvatarModel";

export default function ModelViewer({ text }: { text: string }) {
  const [visemeStrength, setVisemeStrength] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState(""); // Track last spoken text

  const speak = useCallback((text:string) => {
    if (speaking || spokenText === text) return; // Prevent repeat speech
    setSpeaking(true);
    setSpokenText(text); // Mark text as spoken

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    let interval;

    utterance.onstart = () => {
      interval = setInterval(() => {
        setVisemeStrength(Math.random()); // Simulating speech movement
      }, 100);
    };

    utterance.onend = () => {
      clearInterval(interval);
      setVisemeStrength(0); // Reset to closed mouth
      setSpeaking(false);
    };

    synth.speak(utterance);
  }, [speaking, spokenText]);

  useEffect(() => {
    if (text !== "No question found" && spokenText !== text) {
      const timeoutId = setTimeout(() => {
        speak(text);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [text, speak, spokenText]);

  return (
    <div className="relative bg-gray-800 overflow-hidden" style={{ width: "25rem", height: "20rem" }}>
      <div className=" " style={{ width: "25rem", height: "65rem" }}>
        <Canvas camera={{ position: [0, 3, 8], fov: 62 }} >
          <ambientLight intensity={2} />
          <directionalLight position={[0, -3, 5]} intensity={1} />
          <Model visemeStrength={visemeStrength} />
          <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
        </Canvas>
      </div>
    </div>
  );
}
