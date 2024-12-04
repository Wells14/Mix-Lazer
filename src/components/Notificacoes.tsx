import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotificacoesStore } from '@/services/notificacoes';

export function Notificacoes() {
  const { notificacoes, marcarComoLida, removerNotificacao } = useNotificacoesStore();
  const notificacoesNaoLidas = notificacoes.filter((n) => !n.lida);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificacoesNaoLidas.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {notificacoesNaoLidas.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="font-medium">Notificações</span>
          {notificacoesNaoLidas.length > 0 && (
            <span className="text-xs text-gray-500">
              {notificacoesNaoLidas.length} não lidas
            </span>
          )}
        </div>
        <div className="max-h-96 overflow-auto">
          {notificacoes.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              Nenhuma notificação
            </div>
          ) : (
            notificacoes.map((notificacao) => (
              <DropdownMenuItem
                key={notificacao.id}
                className={`px-4 py-3 cursor-default ${
                  !notificacao.lida ? 'bg-gray-50' : ''
                }`}
                onSelect={() => marcarComoLida(notificacao.id)}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      !notificacao.lida ? 'text-primary' : 'text-gray-900'
                    }`}>
                      {notificacao.mensagem}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removerNotificacao(notificacao.id);
                      }}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      ×
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(notificacao.data).toLocaleString()}
                  </span>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
