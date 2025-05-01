"use client";

import { useEffect, useState, useRef } from "react";
import { useWebSocket } from "@/context/websocket-context";
import { Loader2 } from "lucide-react";

export default function CameraView() {
  const { socket, connectionError, errorMessage } = useWebSocket();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const messageHandlerSet = useRef(false);

  useEffect(() => {
    if (!socket || messageHandlerSet.current) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        // Parse the message
        const message = JSON.parse(event.data);

        // Handle video data from the WebSocket
        if (message.type === "video") {
          // console.log("Received video data");
          
          if (typeof message.data === "string" && 
              message.data.startsWith("data:image/jpeg;base64,")) {
            // This is a data URL - directly set it
            setImageUrl(message.data);
            // console.log("Updated image with data URL");
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    // Add the message event listener
    socket.addEventListener("message", handleMessage);
    messageHandlerSet.current = true;

    // Cleanup the event listener when component unmounts
    return () => {
      if (socket) {
        socket.removeEventListener("message", handleMessage);
        messageHandlerSet.current = false;
      }
    };
  }, [socket]);

  // Function to refresh the connection
  const refreshConnection = () => {
    if (imageUrl) {
      // Clear the image URL so the loading indicator shows
      setImageUrl(null);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Camera Feed"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            {connectionError ? (
              <p>{errorMessage || "Connection error. Please check your WebSocket server."}</p>
            ) : socket ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="mt-2">Waiting for camera feed...</p>
              </div>
            ) : (
              <p>Connecting to camera...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
