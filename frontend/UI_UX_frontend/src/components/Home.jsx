import React, { useState } from "react";
import { Menu, Camera, Image } from "lucide-react";
import Sidebar from "./Sidebar";
import "./fonts.css";
import "./background.css";
import axios from "axios";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [result, setResult] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handler for Live Webcam classification.
  // This should capture an image from the webcam (you might use a separate component)
  // and then send it to the backend.
  const handleLiveWebcam = async () => {
    console.log("Live Webcam button clicked.");

    try {
      // Request webcam video stream
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("Webcam stream acquired.");

      // Create a hidden video element to display the stream
      const video = document.createElement("video");
      video.style.display = "none";
      video.srcObject = stream;
      document.body.appendChild(video);

      // Start playing the video
      await video.play();
      console.log("Video is playing.");

      // Wait briefly to ensure the video is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a canvas element to capture a frame from the video
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log("Frame captured from webcam.");

      // Convert the canvas image to a Blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error("Failed to create blob from canvas.");
          return;
        }
        console.log("Image blob created from canvas.");

        // Stop the webcam stream and clean up the video element
        stream.getTracks().forEach((track) => track.stop());
        video.remove();
        console.log("Webcam stream stopped and video element removed.");

        // Create FormData and append the blob
        const formData = new FormData();
        formData.append("file", blob, "live.jpg");
        console.log("FormData prepared. Sending to backend at /run-live...");

        try {
          // Post the captured image to the Flask endpoint for live classification
          const response = await axios.post(
            "http://localhost:5000/run-live",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          console.log("Received response from backend:", response.data);
          setResult(response.data);
        } catch (err) {
          console.error("Error sending captured image to backend:", err);
        }
      }, "image/jpeg");
    } catch (error) {
      console.error("Error accessing the webcam:", error);
    }
  };

  // Handler for Static Image classification
  const handleStaticImages = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    const formData = new FormData();
    // Use the key "file" to match the Flask endpoint expecting "file"
    formData.append("file", files[0]);

    try {
      const response = await fetch("http://localhost:5000/run-static", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Static test output:", data.output);
    } catch (error) {
      console.error("Error running static test:", error);
    }
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

        {result && (
          <div className="mt-4 p-4 bg-white shadow rounded">
            <h2 className="text-xl font-bold">Classification Result:</h2>
            <pre className="text-gray-800">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
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
    </div>
  );
};

export default Home;
