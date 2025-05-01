"use client";
import CameraView from "@/components/camera-view";
import ControlPad from "@/components/control-pad";
import LightSwitch from "@/components/light-switch";
import { useWebSocket } from "@/context/websocket-context";
import { RefreshCw } from "lucide-react";

export default function Home() {
  const { socket, connectionError, errorMessage, reconnect } = useWebSocket();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 bg-gray-100">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Wi-Fi Camera Car Control
        </h1>

        {connectionError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">Connection Error!</p>
                <span className="block sm:inline"> {errorMessage || "Unable to connect to the WebSocket server."}</span>
              </div>
              <button 
                onClick={reconnect}
                className="bg-red-200 hover:bg-red-300 text-red-800 p-1 rounded"
                aria-label="Reconnect"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        )}

        <CameraView />

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <ControlPad />

          <div className="pt-4 border-t border-gray-200">
            <LightSwitch />
          </div>
        </div>
      </div>
    </main>
  );
}
