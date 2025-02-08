import { useEffect, useRef, useState } from 'react';
import {
  nets,
  createCanvasFromMedia,
  resizeResults,
  detectAllFaces,
  matchDimensions,
  draw,
} from 'face-api.js';
import { toast } from '@/hooks/use-toast';

type ExpressionScores = {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
};

function isLightingGood(video: HTMLVideoElement, threshold = 80): boolean {
  // Check if the video dimensions are available
  if (video.videoWidth === 0 || video.videoHeight === 0) {
    console.warn("Video dimensions are not available yet.");
    return false;
  }

  // Create an off-screen canvas with the same dimensions as the video.
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  // Draw the current video frame onto the canvas.
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get pixel data.
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let totalLuminance = 0;
  const pixelCount = data.length / 4;

  // Calculate the average luminance.
  // Luminance formula: 0.299 * R + 0.587 * G + 0.114 * B
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    totalLuminance += luminance;
  }
  const avgLuminance = totalLuminance / pixelCount;
  console.log("avgLuminance:", avgLuminance);
  
  // Return true if the average brightness is above the threshold.
  return avgLuminance > threshold;
}

function evaluateEmotionalState(expressions: ExpressionScores): string {
  // Define the weight map for each derived emotional state.
  const weights: Record<string, Partial<Record<keyof ExpressionScores, number>>> = {
    // Nervous: driven by fearful, sad, and surprised.
    nervous: { fearful: 0.7, sad: 0.5, surprised: 0.3 },
    // Anxious: similar to nervous but with a slight emphasis on fear and surprise.
    anxious: { fearful: 0.6, surprised: 0.4 },
    // Frustrated: high when anger and disgust dominate.
    frustrated: { angry: 1.0, disgusted: 0.8 },
    // Confident: increases with happiness and a calm, neutral look.
    confident: { happy: 0.6, neutral: 0.4 },
    // Excited: when happy and surprised are both elevated.
    excited: { happy: 0.7, surprised: 0.5 },
    // Direct readings.
    sad: { sad: 1.0 },
    neutral: { neutral: 1.0 },
  };

  // Calculate cumulative scores for each state.
  const scores: { [state: string]: number } = {};
  for (const [state, exprWeights] of Object.entries(weights)) {
    scores[state] = 0;
    for (const [expr, weight] of Object.entries(exprWeights)) {
      scores[state] += expressions[expr as keyof ExpressionScores] * (weight ?? 0);
    }
  }

  // Sort states by descending score.
  const sortedStates = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topState, topScore] = sortedStates[0];
  const secondScore = sortedStates.length > 1 ? sortedStates[1][1] : 0;

  // Define thresholds.
  const MIN_CONFIDENCE = 0.3;   // Minimum score needed for a state to be considered.
  const DIFF_THRESHOLD = 0.1;   // Top state must exceed the runner-up by at least this much.

  // Return "undetermined" if the top score is too low or not significantly higher than the second.
  if (topScore < MIN_CONFIDENCE || (topScore - secondScore) < DIFF_THRESHOLD) {
    return 'undetermined';
  }

  return topState;
}

function InterviewPage() {

  const [emotionalState, setEmotionalState] = useState('undetermined');

  const MODEL_URL = '/models'; // Path where models are stored
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let animationFrameId: number;

  // Load only the necessary models for detection, landmarks, and expressions.
  async function loadModels() {
    await Promise.all([
      nets.ssdMobilenetv1.loadFromUri(MODEL_URL), // Face detection
      nets.faceLandmark68Net.loadFromUri(MODEL_URL), // Facial landmarks
      nets.faceExpressionNet.loadFromUri(MODEL_URL), // Facial expressions
    ]);
  }

  async function startWebcam() {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Error accessing webcam:', err);
    }
  }

  async function detectFace() {
    await loadModels();
    await startWebcam();

    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('loadedmetadata', () => {
      video.play();

      // Create canvas only once.
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
          .withFaceLandmarks()      // Needed for drawing & further analysis
          .withFaceExpressions();   // Tracks emotions

        if (detections && detections.length > 0) {
          const { expressions } = detections[0];
          const newEmotionalState = evaluateEmotionalState(expressions);
          setEmotionalState((prevState) =>
            prevState !== newEmotionalState ? newEmotionalState : prevState
          );
        } else {
          console.warn('No face detected 😢');
        }

        // Draw the detections on the canvas.
        const resizedDetections = detections ? resizeResults(detections, displaySize) : [];
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (resizedDetections.length > 0) {
            draw.drawDetections(canvas, resizedDetections);
            draw.drawFaceExpressions(canvas, resizedDetections);
          }
        }

        animationFrameId = requestAnimationFrame(processVideoFrame);
      };

      processVideoFrame();
    });
  }

  useEffect(() => {
    detectFace();

    // Copy the refs to local variables for cleanup.
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    videoRef.current?.addEventListener('loadedmetadata', () => {
      if (videoRef.current) {
        const lightingGood = isLightingGood(videoRef.current);
        if (!lightingGood) {
          toast({
            title: "🌞 Poor lighting detected",
          });
        }
      }
    });

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (videoElement?.srcObject) {
        (videoElement.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
      if (canvasElement && canvasElement.parentNode) {
        canvasElement.parentNode.removeChild(canvasElement);
      }
    };
  }, []);

  return (
    <div className="">
      <h3>Interview Analysis</h3>
      <div className="video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          aria-label="Live camera feed for emotion detection"
        />
        <canvas ref={canvasRef} aria-label="Face detection overlay" />
      </div>
      <div className="mt-4 px-4 text-xl">
        Current detected state: <strong>{emotionalState}</strong>
      </div>
    </div>
  );
}

export default InterviewPage;
