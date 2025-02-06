import { nets, createCanvasFromMedia, resizeResults, detectAllFaces, matchDimensions, draw } from 'face-api.js';
import { useEffect } from 'react';

function InterviewPage() {

  const MODEL_URL = '/models'; // Path where models are stored
  async function loadModels() {
    await nets.ssdMobilenetv1.loadFromUri(MODEL_URL); // Face detection model
    await nets.faceLandmark68Net.loadFromUri(MODEL_URL); // Facial landmark model
    await nets.faceRecognitionNet.loadFromUri(MODEL_URL); // Face recognition model
    await nets.faceExpressionNet.loadFromUri(MODEL_URL); // Face recognition model
    await nets.ageGenderNet.loadFromUri(MODEL_URL); // Age & Gender model
  }

  async function detectFace() {
    const video = document.getElementById('video') as HTMLVideoElement | null;

    if (!video) {
      console.error("Video element not found!");
    } else {
      // Start webcam
      navigator.mediaDevices?.getUserMedia({ video: {} })
        .then((stream) => {
          video.srcObject = stream;
        })
        .catch((err) => console.error("Error accessing webcam: ", err));

      // Wait until video metadata is loaded before accessing width/height
      video.addEventListener('loadedmetadata', () => {
        video.play(); // Ensure the video starts playing

        const canvas = createCanvasFromMedia(video) as HTMLCanvasElement;
        document.body.append(canvas);

        const displaySize = { width: video.videoWidth, height: video.videoHeight }; // ✅ Correct width/height
        matchDimensions(canvas, displaySize);

        setInterval(async () => {
          const detections = await detectAllFaces(video)
            .withFaceLandmarks()
            .withFaceExpressions(); // Detect expressions

          const resizedDetections = resizeResults(detections, displaySize);
          const ctx = canvas.getContext('2d');

          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            draw.drawDetections(canvas, resizedDetections);
            draw.drawFaceExpressions(canvas, resizedDetections);
          }

          // Log expressions (optional)
          if (detections.length > 0) {
            console.log(detections[0].expressions);
          }
        }, 1000);
      });
    }
  }

  useEffect(() => {
    loadModels();
    detectFace();
  }, [])

  return (
    <div>
      <h3>InterviewPage</h3>
      <video id="video" autoPlay playsInline></video>
    </div>
  )
}

export default InterviewPage