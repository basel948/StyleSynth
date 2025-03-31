import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const LiveWebcam = ({ selectedHairstyle, selectedFilter }) => {
  const [activateCamera, setActivateCamera] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const filterImgRef = useRef(new Image());

  const handleActivateCamera = () => setActivateCamera(true);

  useEffect(() => {
    if (selectedFilter) {
      filterImgRef.current.src = selectedFilter.asset;
    }
  }, [selectedFilter]);

  useEffect(() => {
    if (!activateCamera || !webcamRef.current?.video) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    faceMesh.onResults(onResults);

    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () =>
        await faceMesh.send({ image: webcamRef.current.video }),
      width: 640,
      height: 480,
    });
    camera.start();
  }, [activateCamera]);

  function onResults(results) {
    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiFaceLandmarks) {
      results.multiFaceLandmarks.forEach((landmarks) => {
        drawConnectors(ctx, landmarks, FaceMesh.FACEMESH_TESSELATION);
        drawLandmarks(ctx, landmarks, { color: "#FF2C35", radius: 1 });
      });

      if (filterImgRef.current.src) {
        const [leftEye, rightEye] = [
          results.multiFaceLandmarks[0][33],
          results.multiFaceLandmarks[0][263],
        ];
        const x1 = leftEye.x * canvas.width;
        const y1 = leftEye.y * canvas.height;
        const x2 = rightEye.x * canvas.width;
        const y2 = rightEye.y * canvas.height;
        const width = Math.hypot(x2 - x1, y2 - y1) * 2;
        const height =
          (filterImgRef.current.height / filterImgRef.current.width) * width;
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;

        ctx.drawImage(
          filterImgRef.current,
          centerX - width / 2,
          centerY - height / 2,
          width,
          height
        );
      }
    }
    ctx.restore();
  }

  return (
    <div className="relative w-full max-w-4xl mb-4">
      {activateCamera ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-[550px] border rounded shadow-lg object-cover"
            onUserMedia={() => console.log("Webcam access granted.")}
            onUserMediaError={(err) =>
              console.error("Error accessing webcam:", err)
            }
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center border rounded shadow-lg w-full h-[500px] bg-gray-200">
          <p className="mb-4 text-lg text-gray-800">
            Please allow camera access to activate webcam
          </p>
          <button
            onClick={handleActivateCamera}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Activate Webcam
          </button>
        </div>
      )}

      {selectedHairstyle && (
        <img
          src={selectedHairstyle}
          alt="Hairstyle Overlay"
          className="absolute"
          style={{
            top: "20%",
            left: "60%",
            width: "200px",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

export default LiveWebcam;
