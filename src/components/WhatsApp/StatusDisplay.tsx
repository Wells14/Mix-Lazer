import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { WhatsAppState } from "@/services/whatsapp/types";

interface StatusDisplayProps {
  state: WhatsAppState;
  onReconnect: () => void;
  onDisconnect: () => void;
}

export const StatusDisplay = ({ state, onReconnect, onDisconnect }: StatusDisplayProps) => {
  const getStatusColor = () => {
    switch (state.status) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "connecting":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getStatusText = () => {
    switch (state.status) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      default:
        return "Disconnected";
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 items-center">
      <div>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      <div>{state.lastUpdate || "Not connected"}</div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onReconnect}
          disabled={state.status === "connecting"}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reconnect
        </Button>
      </div>
      <div>
        {state.status === "connected" && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600"
            onClick={onDisconnect}
          >
            Disconnect
          </Button>
        )}
      </div>
    </div>
  );
};