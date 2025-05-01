"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Define the context type
type WebSocketContextType = {
  socket: WebSocket | null;
  connectionError: boolean;
  errorMessage: string;
  sendMessage: (type: string, data: any) => void;
  reconnect: () => void;
};

// Create the WebSocket context
const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  connectionError: false,
  errorMessage: "",
  sendMessage: () => {},
  reconnect: () => {},
});

// Create a provider component
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reconnectionAttempt, setReconnectionAttempt] = useState(0);

  const connectWebSocket = () => {
    if (socket?.readyState === WebSocket.OPEN) return;
    
    // Close existing socket if it exists
    if (socket) {
      socket.close();
    }

      console.log("Creating new WebSocket connection...");

    // Use the correct environment variable
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsUrl) {
      console.error("WebSocket URL not defined in environment variables");
      setConnectionError(true);
      setErrorMessage("WebSocket URL not defined in environment variables");
      return;
    }

    try {
      const ws = new WebSocket(wsUrl);
      
      // Set a connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.error("WebSocket connection timed out");
          ws.close();
          setConnectionError(true);
          setErrorMessage(`Connection to ${wsUrl} timed out`);
        }
      }, 5000);

      ws.onopen = () => {
        console.log("WebSocket connected successfully");
        clearTimeout(connectionTimeout);
        setSocket(ws);
        setConnectionError(false);
        setErrorMessage("");

        // Identify this client as a control client
        ws.send(JSON.stringify({ type: "identify", data: "control" }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          // console.log("Message received:", message);
          // Handle incoming messages here if needed
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = (event) => {
        console.log(`WebSocket disconnected (code: ${event.code}), attempting to reconnect...`);
        clearTimeout(connectionTimeout);
        setSocket(null);
        
        if (!event.wasClean) {
          setConnectionError(true);
          setErrorMessage(`Connection closed unexpectedly (code: ${event.code})`);
        }

        setTimeout(() => {
            setReconnectionAttempt((prev) => prev + 1);
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket encountered an error:", error);
        clearTimeout(connectionTimeout);
        setConnectionError(true);
        setErrorMessage("Failed to connect to the WebSocket server. Please check if the server is running.");
      };
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      setConnectionError(true);
      setErrorMessage(`Error creating WebSocket: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Connect to WebSocket when component mounts or reconnection is attempted
  useEffect(() => {
    connectWebSocket();

      return () => {
      if (socket) {
        console.log("Cleaning up WebSocket...");
        socket.close();
      }
      };
  }, [reconnectionAttempt]);

  const sendMessage = (type: string, data: any) => {
    console.log("Sending message:", { type, data });
    if (socket?.readyState === WebSocket.OPEN) {
      // Format the message as expected by the WS server
      const message = JSON.stringify({ type, data });
      console.log("Raw message being sent:", message);
      socket.send(message);
    } else {
      console.warn("WebSocket is not open. Cannot send message. ReadyState:", socket?.readyState);
    }
  };

  const reconnect = () => {
    setReconnectionAttempt((prev) => prev + 1);
  };

  return (
    <WebSocketContext.Provider value={{ 
      socket, 
      connectionError, 
      errorMessage,
      sendMessage, 
      reconnect 
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Create a custom hook to use the WebSocket context
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
