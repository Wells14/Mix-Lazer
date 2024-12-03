export interface WhatsAppState {
  status: "disconnected" | "connecting" | "connected";
  qrCode: string | null;
  lastUpdate: string;
  error: string | null;
}

export interface WhatsAppService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getState(): WhatsAppState;
}