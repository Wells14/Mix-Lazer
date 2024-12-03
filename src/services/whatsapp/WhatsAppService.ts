import { WhatsAppState, WhatsAppService } from './types';

class WebWhatsAppService implements WhatsAppService {
  private state: WhatsAppState = {
    status: "disconnected",
    qrCode: null,
    lastUpdate: new Date().toLocaleString(),
    error: null
  };

  private stateListeners: ((state: WhatsAppState) => void)[] = [];
  private wsConnection: WebSocket | null = null;

  constructor() {
    this.connectWebSocket();
  }

  private connectWebSocket() {
    // Usando localhost:3000 para desenvolvimento local
    const wsUrl = `ws://${window.location.hostname}:3000`;
    
    try {
      this.wsConnection = new WebSocket(wsUrl);
      
      this.wsConnection.onopen = () => {
        console.log('WebSocket connected successfully');
      };
      
      this.wsConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'whatsapp-state') {
          this.setState(data.state);
        }
      };

      this.wsConnection.onclose = () => {
        console.log('WebSocket connection closed');
        this.setState({
          status: "disconnected",
          qrCode: null,
          lastUpdate: new Date().toLocaleString(),
          error: "Conexão com o servidor perdida"
        });
        
        // Tenta reconectar após 5 segundos
        setTimeout(() => this.connectWebSocket(), 5000);
      };

      this.wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }

  private setState(newState: Partial<WhatsAppState>) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  private notifyListeners() {
    this.stateListeners.forEach(listener => listener(this.state));
  }

  public addStateListener(listener: (state: WhatsAppState) => void) {
    this.stateListeners.push(listener);
    listener(this.state);
    return () => {
      this.stateListeners = this.stateListeners.filter(l => l !== listener);
    };
  }

  async connect(): Promise<void> {
    try {
      const response = await fetch(`http://${window.location.hostname}:3000/whatsapp/connect`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Falha ao conectar ao WhatsApp');
      }
      
      this.setState({ status: "connecting" });
    } catch (error) {
      console.error("Failed to connect to WhatsApp:", error);
      this.setState({
        status: "disconnected",
        error: "Falha ao conectar ao WhatsApp",
        lastUpdate: new Date().toLocaleString()
      });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      const response = await fetch(`http://${window.location.hostname}:3000/whatsapp/disconnect`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Falha ao desconectar do WhatsApp');
      }
      
      this.setState({
        status: "disconnected",
        qrCode: null,
        lastUpdate: new Date().toLocaleString()
      });
    } catch (error) {
      console.error("Error disconnecting:", error);
      throw error;
    }
  }

  async sendMessage(to: string, message: string): Promise<void> {
    if (!this.isConnected()) {
      throw new Error("WhatsApp não está conectado");
    }

    try {
      const response = await fetch(`http://${window.location.hostname}:3000/whatsapp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to, message })
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar mensagem');
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.state.status === "connected";
  }

  getState(): WhatsAppState {
    return this.state;
  }
}

export const whatsAppService = new WebWhatsAppService();