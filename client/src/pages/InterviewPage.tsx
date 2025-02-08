import { useEffect, useRef } from 'react';
import {
  nets,
  createCanvasFromMedia,
  resizeResults,
  detectAllFaces,
  matchDimensions,
  draw,
} from 'face-api.js';

type ExpressionScores = {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
};

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
          const emotionalState = evaluateEmotionalState(expressions);
          console.log(`User appears ${emotionalState}!`);
          // Optionally: update UI elements based on the emotionalState
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
    <div>
      <h3>InterviewPage</h3>
      <video ref={videoRef} id="video" autoPlay playsInline></video>
    </div>
  );
}

export default InterviewPage;
