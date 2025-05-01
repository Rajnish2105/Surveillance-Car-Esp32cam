"use client";

import { useWebSocket } from "@/context/websocket-context";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

export default function ControlPad() {
  const { sendMessage } = useWebSocket();

  const handleTouchStart = (direction: string) => {
    let action = "";

    switch (direction) {
      case "1": // Up
        action = "move_forward";
        break;
      case "2": // Down
        action = "move_backward";
        break;
      case "3": // Left
        action = "turn_left";
        break;
      case "4": // Right
        action = "turn_right";
        break;
      default:
        return;
    }

    sendMessage("control", { action });
  };

  const handleTouchEnd = () => {
    sendMessage("control", { action: "stop" });
  };

  return (
    <div className="select-none">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Controls</h2>

      <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
        {/* Empty cell */}
        <div></div>

        {/* Up button */}
        <button
          className="bg-gray-800 hover:bg-gray-700 active:translate-y-1 active:shadow-none text-white rounded-xl h-14 w-14 flex items-center justify-center shadow-md transition-all mx-auto"
          onTouchStart={() => handleTouchStart("1")}
          onTouchEnd={handleTouchEnd}
          onMouseDown={() => handleTouchStart("1")}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          <ArrowUp size={28} />
        </button>

        {/* Empty cell */}
        <div></div>

        {/* Left button */}
        <button
          className="bg-gray-800 hover:bg-gray-700 active:translate-x-1 active:shadow-none text-white rounded-xl h-14 w-14 flex items-center justify-center shadow-md transition-all mx-auto"
          onTouchStart={() => handleTouchStart("3")}
          onTouchEnd={handleTouchEnd}
          onMouseDown={() => handleTouchStart("3")}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          <ArrowLeft size={28} />
        </button>

        {/* Empty cell */}
        <div className="h-14 w-14"></div>

        {/* Right button */}
        <button
          className="bg-gray-800 hover:bg-gray-700 active:-translate-x-1 active:shadow-none text-white rounded-xl h-14 w-14 flex items-center justify-center shadow-md transition-all mx-auto"
          onTouchStart={() => handleTouchStart("4")}
          onTouchEnd={handleTouchEnd}
          onMouseDown={() => handleTouchStart("4")}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          <ArrowRight size={28} />
        </button>

        {/* Empty cell */}
        <div></div>

        {/* Down button */}
        <button
          className="bg-gray-800 hover:bg-gray-700 active:-translate-y-1 active:shadow-none text-white rounded-xl h-14 w-14 flex items-center justify-center shadow-md transition-all mx-auto"
          onTouchStart={() => handleTouchStart("2")}
          onTouchEnd={handleTouchEnd}
          onMouseDown={() => handleTouchStart("2")}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          <ArrowDown size={28} />
        </button>

        {/* Empty cell */}
        <div></div>
      </div>
    </div>
  );
}
