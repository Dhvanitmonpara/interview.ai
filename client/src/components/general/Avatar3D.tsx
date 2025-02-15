import React, { useEffect, useState, useRef } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Model = ({ visemeStrength }) => {
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

export default function ModelViewer() {
  const [visemeStrength, setVisemeStrength] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  const speak = (text = "Hello, Dhvanit and all askedium member good night") => {
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
  };

  return (
    <div className=" bg-gray-200 overflow-hidden" style={{ width: "25vw", height: "50vh", position: "absulate" }}>
      <div className=" " style={{ width: "50vh", height: "80vw", position: "" }}>
        <Canvas camera={{ position: [0, 3, 8], fov: 62 }} >
        <ambientLight intensity={2} />
        <directionalLight position={[0, -3, 5]} intensity={1} />
        <Model visemeStrength={visemeStrength} />
        <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
      </Canvas>
        </div>
      <button
        onClick={() => speak()}
        disabled={speaking}
        style={{  position: "absolute",  top: "20px",left: "50%",transform: "translateX(-50%)",fontSize: "16px",cursor: "pointer",}}
      >
        {speaking ? "Speaking..." : "Speak"}
      </button>
    </div>
  );
}
