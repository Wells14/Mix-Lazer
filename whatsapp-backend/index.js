import express from 'express';
import { WebSocketServer } from 'ws';
import { Client } from 'whatsapp-web.js';
import cors from 'cors';
import qrcode from 'qrcode';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

let whatsappClient = null;
let clientState = {
  status: 'disconnected',
  qrCode: null,
  lastUpdate: new Date().toLocaleString(),
  error: null
};

const broadcastState = () => {
  wss.clients.forEach(client => {
    client.send(JSON.stringify({
      type: 'whatsapp-state',
      state: clientState
    }));
  });
};

const initializeWhatsAppClient = () => {
  whatsappClient = new Client({});

  whatsappClient.on('qr', async (qr) => {
    clientState = {
      ...clientState,
      status: 'connecting',
      qrCode: qr,
      lastUpdate: new Date().toLocaleString()
    };
    broadcastState();
  });

  whatsappClient.on('ready', () => {
    clientState = {
      ...clientState,
      status: 'connected',
      qrCode: null,
      lastUpdate: new Date().toLocaleString()
    };
    broadcastState();
  });

  whatsappClient.on('disconnected', () => {
    clientState = {
      ...clientState,
      status: 'disconnected',
      qrCode: null,
      lastUpdate: new Date().toLocaleString()
    };
    broadcastState();
    whatsappClient = null;
  });

  return whatsappClient;
};

// Endpoint para iniciar conexão
app.post('/whatsapp/connect', async (req, res) => {
  try {
    if (!whatsappClient) {
      whatsappClient = initializeWhatsAppClient();
      await whatsappClient.initialize();
    }
    res.json({ status: 'initializing' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para desconectar
app.post('/whatsapp/disconnect', async (req, res) => {
  try {
    if (whatsappClient) {
      await whatsappClient.destroy();
      whatsappClient = null;
      clientState = {
        status: 'disconnected',
        qrCode: null,
        lastUpdate: new Date().toLocaleString(),
        error: null
      };
      broadcastState();
    }
    res.json({ status: 'disconnected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para enviar mensagem
app.post('/whatsapp/send', async (req, res) => {
  try {
    const { to, message } = req.body;
    if (!whatsappClient) {
      throw new Error('WhatsApp client not connected');
    }
    await whatsappClient.sendMessage(to, message);
    res.json({ status: 'sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
  ws.send(JSON.stringify({
    type: 'whatsapp-state',
    state: clientState
  }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});