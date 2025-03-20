import React, { useState, useRef, useEffect } from "react";
import { Menu, Camera, Image } from "lucide-react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./fonts.css";
import "./background.css";
import PopUpCard from "./PopUpCard";
import LoadingOverlay from "./LoadingOverlay";
// parseResults assumes the backend returns a valid JSON string.
const parseResults = (output) => {
  try {
    return JSON.parse(output);
  } catch (error) {
    console.error("Error parsing classification output:", error);
    return {};
  }
};

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showWebcamModal, setShowWebcamModal] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // WebcamModal defined inside Home.jsx
  const WebcamModal = ({ onCapture, onClose }) => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);

    useEffect(() => {
      async function startStream() {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            await videoRef.current.play();
          }
        } catch (error) {
          console.error("Error accessing webcam:", error);
        }
      }
      startStream();

      return () => {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }, []);

    const handleCapture = () => {
      if (!videoRef.current) return;
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      // Create a preview URL for the popup
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(imageDataUrl, blob);
        }
      }, "image/jpeg");
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded shadow-lg relative w-full max-w-3xl">
          <video ref={videoRef} className="w-full h-auto" autoPlay />
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={handleCapture}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Capture
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // For Live Webcam: simply show the modal.
  const handleLiveWebcam = () => {
    setShowWebcamModal(true);
  };

  // Called when the user manually captures an image from the modal.
  const handleWebcamCapture = async (imageDataUrl, blob) => {
    setShowWebcamModal(false);
    setLoading(true);
    setLoadingMessage("Classifying image...");
    const formData = new FormData();
    formData.append("file", blob, "live.jpg");
    try {
      const response = await axios.post(
        "http://localhost:5000/run-live",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Full classification output (live):", response.data.output);
      setPopupData({
        image: imageDataUrl,
        results: parseResults(response.data.output),
      });
    } catch (err) {
      console.error("Error sending captured image to backend:", err);
    }
    setLoading(false);
    setLoadingMessage("");
  };

  // Handler for Static Image classification.
  const handleStaticImages = async (event) => {
    const files = event.target.files;
    if (!files.length) return;
    setLoading(true);
    setLoadingMessage("Uploading image...");
    const file = files[0];
    const previewURL = URL.createObjectURL(file);
    const formData = new FormData();
    formData.append("file", file);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoadingMessage("Classifying image...");
    try {
      const response = await fetch("http://localhost:5000/run-static", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Full classification output (static):", data.output);
      setPopupData({
        image: previewURL,
        results: parseResults(data.output),
      });
    } catch (error) {
      console.error("Error running static test:", error);
    }
    setLoading(false);
    setLoadingMessage("");
  };

  return (
    <div className="relative h-screen w-full bg-container overflow-hidden">
      {/* Background elements */}
      <div className="background-design">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
      </div>

      {/* Main content */}
      <div className="flex flex-col h-screen w-full items-center justify-center gap-8 z-10 relative">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2 font-heading drop-shadow-sm">
          Classify Your Face Shape
        </h1>
        <p className="text-gray-700 text-center max-w-md mb-6 font-subheading px-4">
          Choose a method to analyze your face shape and get personalized
          hairstyle recommendations
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-6">
          <button
            onClick={handleLiveWebcam}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl w-64 font-button"
          >
            <Camera size={24} />
            <span className="font-medium">Live Webcam</span>
          </button>

          <label
            htmlFor="staticUpload"
            className="flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl w-64 font-button cursor-pointer"
          >
            <Image size={24} />
            <span className="font-medium">Via Images</span>
          </label>
          <input
            id="staticUpload"
            type="file"
            multiple
            onChange={handleStaticImages}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* Sidebar toggle button */}
      <button
        className="absolute top-4 left-4 z-30 bg-gray-900 bg-opacity-70 backdrop-blur-sm text-white p-2 rounded-md hover:bg-gray-800 transition-colors"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={toggleSidebar}
      />

      {/* Loading overlay with spinner and message */}
      {loading && <LoadingOverlay message={loadingMessage} />}

      {/* Webcam modal for manual capture */}
      {showWebcamModal && (
        <WebcamModal
          onCapture={handleWebcamCapture}
          onClose={() => setShowWebcamModal(false)}
        />
      )}

      {/* Popup overlay card */}
      {popupData && (
        <PopUpCard
          image={popupData.image}
          results={popupData.results}
          onClose={() => setPopupData(null)}
        />
      )}
    </div>
  );
};

export default Home;
