"use client";

import { useState } from "react";
import { useWebSocket } from "@/context/websocket-context";
import { Switch } from "@/components/ui/switch";
import { Sun } from "lucide-react";

export default function LightSwitch() {
  const [isLightOn, setIsLightOn] = useState(false);
  const { sendMessage } = useWebSocket();

  const toggleLight = (checked: boolean) => {
    setIsLightOn(checked);
    sendMessage("control", {
      action: "light",
      state: checked ? "on" : "off",
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Sun className="h-5 w-5 text-yellow-500" />
        <span className="font-medium text-gray-700">Light</span>
      </div>

      <Switch checked={isLightOn} onCheckedChange={toggleLight} />
    </div>
  );
}
