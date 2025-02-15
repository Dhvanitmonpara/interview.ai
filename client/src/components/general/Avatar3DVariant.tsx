import { useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./AvatarModel";

export default function ModelViewer({ text }: { text: string }) {
  const [visemeStrength, setVisemeStrength] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback((text) => {
    if (speaking) return;
    setSpeaking(true);

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
  }, [speaking])

  useEffect(() => {
    if (text !== "No question found") {
      const timeoutId = setTimeout(() => {
        speak(text);
      }, 4000);

      return () => clearTimeout(timeoutId);
    }
  }, [text, speak]);

  return (
    <div className="relative bg-gray-800 overflow-hidden" style={{ width: "30rem", height: "30rem" }}>
      <div className=" " style={{ width: "30rem", height: "95rem" }}>
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