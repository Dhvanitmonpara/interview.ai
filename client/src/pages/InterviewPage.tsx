import { useEffect, useRef } from 'react';
import {
  nets,
  createCanvasFromMedia,
  resizeResults,
  detectAllFaces,
  matchDimensions,
  draw,
} from 'face-api.js';

function InterviewPage() {
  const MODEL_URL = '/models'; // Path where models are stored
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let animationFrameId: number;

  // Load models once when component mounts
  async function loadModels() {
    await Promise.all([
      nets.ssdMobilenetv1.loadFromUri(MODEL_URL), // Face detection
      nets.faceLandmark68Net.loadFromUri(MODEL_URL), // Landmarks
      nets.faceRecognitionNet.loadFromUri(MODEL_URL), // Recognition
      nets.faceExpressionNet.loadFromUri(MODEL_URL), // Expressions
      nets.ageGenderNet.loadFromUri(MODEL_URL), // Age & Gender
    ]);
  }

  async function startWebcam() {
    if (!videoRef.current) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Error accessing webcam: ', err);
    }
  }

  async function detectFace() {
    await loadModels();
    await startWebcam();

    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('loadedmetadata', () => {
      video.play();

      // Create canvas only once
      if (!canvasRef.current) {
        const canvas = createCanvasFromMedia(video) as HTMLCanvasElement;
        document.body.append(canvas);
        canvasRef.current = canvas;
      }

      const canvas = canvasRef.current!;
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      matchDimensions(canvas, displaySize);

      const processVideoFrame = async () => {
        const detections = await detectAllFaces(video)
          .withFaceLandmarks()
          .withAgeAndGender()
          .withFaceDescriptors()
          .withFaceExpressions();

        const resizedDetections = resizeResults(detections, displaySize);
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          draw.drawDetections(canvas, resizedDetections);
          draw.drawFaceExpressions(canvas, resizedDetections);
        }

        // Log expressions (optional)
        if (detections.length > 0) {
          console.log({
            expressions: detections[0].expressions,
            age: detections[0].age,
            gender: detections[0].gender,
            genderProbability: detections[0].genderProbability,
          });
        }

        animationFrameId = requestAnimationFrame(processVideoFrame);
      };

      // Start processing frames
      processVideoFrame();
    });
  }

  useEffect(() => {
    detectFace();

    // Store refs inside effect to prevent accessing updated values
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      if (videoElement?.srcObject) {
        (videoElement.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }

      if (canvasElement) {
        document.body.removeChild(canvasElement);
      }
    };
  }, []);

  return (
    <div>
      <h3>InterviewPage</h3>
      <video ref={videoRef} id="video" autoPlay playsInline></video>
    </div>
  );
}

export default InterviewPage;
