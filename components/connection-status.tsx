"use client";

import { useWebSocket } from "@/context/websocket-context";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

export default function ConnectionStatus() {
  const { socket, connectionError, errorMessage, reconnect } = useWebSocket();

  return (
    <div className="flex items-center gap-2">
      {socket ? (
        <div className="flex items-center gap-1 text-green-600">
          <Wifi size={16} />
          <span className="text-sm">Connected</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-red-600">
            <WifiOff size={16} />
            <span className="text-sm" title={errorMessage || ""}>
              {connectionError ? "Connection Error" : "Disconnected"}
            </span>
          </div>
          <button
            onClick={reconnect}
            className="p-1 bg-gray-100 rounded hover:bg-gray-200"
            title="Try reconnecting"
          >
            <RefreshCw size={14} className="text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
}
