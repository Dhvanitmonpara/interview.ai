import React, { useEffect, useState, useRef, useCallback } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Model = ({ visemeStrength }: { visemeStrength: string }) => {
  const gltf = useLoader(GLTFLoader, "https://models.readyplayer.me/67b05852f9904b1648fe40fd.glb");
  const mouthMeshRef = useRef(null);

  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.name === "Wolf3D_Head" && child.morphTargetDictionary) {
          console.log("✅ Morph Targets Found:", child.morphTargetDictionary);
          mouthMeshRef.current = child;
        }
      });
    }
  }, [gltf]);

  useFrame(() => {
    if (mouthMeshRef.current) {
      const morphTargets = mouthMeshRef.current.morphTargetDictionary;

      // Smooth transition (lerp) instead of instant switch
      if (morphTargets.mouthOpen !== undefined) {
        const index = morphTargets.mouthOpen;
        mouthMeshRef.current.morphTargetInfluences[index] += (visemeStrength - mouthMeshRef.current.morphTargetInfluences[index]) * 0.3;
      }
    }
  });

  return <primitive object={gltf.scene} scale={[3, 1.8, 2]} />;
};

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
    <div className="relative bg-gray-800 overflow-hidden" style={{ width: "25rem", height: "20rem", position: "absulate" }}>
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