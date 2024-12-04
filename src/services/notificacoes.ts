import { create } from 'zustand';

interface Notificacao {
  id: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  mensagem: string;
  data: Date;
  lida: boolean;
}

interface NotificacoesStore {
  notificacoes: Notificacao[];
  adicionarNotificacao: (tipo: Notificacao['tipo'], mensagem: string) => void;
  marcarComoLida: (id: string) => void;
  removerNotificacao: (id: string) => void;
  limparNotificacoes: () => void;
}

export const useNotificacoesStore = create<NotificacoesStore>((set) => ({
  notificacoes: [],
  
  adicionarNotificacao: (tipo, mensagem) => set((state) => ({
    notificacoes: [
      {
        id: crypto.randomUUID(),
        tipo,
        mensagem,
        data: new Date(),
        lida: false,
      },
      ...state.notificacoes,
    ],
  })),

  marcarComoLida: (id) => set((state) => ({
    notificacoes: state.notificacoes.map((notificacao) =>
      notificacao.id === id ? { ...notificacao, lida: true } : notificacao
    ),
  })),

  removerNotificacao: (id) => set((state) => ({
    notificacoes: state.notificacoes.filter((notificacao) => notificacao.id !== id),
  })),

  limparNotificacoes: () => set({ notificacoes: [] }),
}));
