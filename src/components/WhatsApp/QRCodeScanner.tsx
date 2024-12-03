import { QrCode } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent } from "@/components/ui/card";

interface QRCodeScannerProps {
  qrCode: string | null;
  onScan: () => void;
}

export const QRCodeScanner = ({ qrCode, onScan }: QRCodeScannerProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 p-6">
        {qrCode ? (
          <div className="flex flex-col items-center gap-4">
            <div className="text-sm text-gray-500 text-center">
              <p className="mb-2">Abra o WhatsApp no seu celular</p>
              <p>Vá em Configurações {'>'} Aparelhos conectados {'>'} Conectar dispositivo</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <QRCodeSVG value={qrCode} size={256} level="H" />
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Aponte a câmera do seu celular para este QR Code
            </div>
          </div>
        ) : (
          <Button onClick={onScan} className="w-full">
            <QrCode className="h-4 w-4 mr-2" />
            Gerar QR Code
          </Button>
        )}
      </CardContent>
    </Card>
  );
};