import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Smartphone } from "lucide-react";
import { QRCodeScanner } from "@/components/WhatsApp/QRCodeScanner";
import { StatusDisplay } from "@/components/WhatsApp/StatusDisplay";
import { whatsAppService } from "@/services/whatsapp/WhatsAppService";
import { WhatsAppState } from "@/services/whatsapp/types";

const WhatsAppConnection = () => {
  const [state, setState] = useState<WhatsAppState>(whatsAppService.getState());

  useEffect(() => {
    console.log("Setting up WhatsApp connection listeners");
    const unsubscribe = whatsAppService.addStateListener((newState) => {
      console.log("WhatsApp state updated:", newState);
      setState(newState);
    });

    return () => {
      console.log("Cleaning up WhatsApp connection listeners");
      unsubscribe();
    };
  }, []);

  const handleReconnect = async () => {
    console.log("Attempting to reconnect");
    try {
      await whatsAppService.connect();
      toast.success("WhatsApp connected successfully!");
    } catch (error) {
      console.error("Failed to reconnect:", error);
      toast.error("Failed to connect to WhatsApp. Please try again.");
    }
  };

  const handleDisconnect = async () => {
    console.log("Disconnecting from WhatsApp");
    try {
      await whatsAppService.disconnect();
      toast.success("Disconnected from WhatsApp");
    } catch (error) {
      console.error("Failed to disconnect:", error);
      toast.error("Failed to disconnect from WhatsApp");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Smartphone className="h-6 w-6" />
            WhatsApp Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <QRCodeScanner
              qrCode={state.qrCode}
              onScan={handleReconnect}
            />
            
            <div className="grid grid-cols-4 gap-4 text-sm font-medium border-b pb-4">
              <div>Status</div>
              <div>Last Update</div>
              <div>Session</div>
              <div>Actions</div>
            </div>

            <StatusDisplay
              state={state}
              onReconnect={handleReconnect}
              onDisconnect={handleDisconnect}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppConnection;