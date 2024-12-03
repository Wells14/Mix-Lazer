import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StatusCardProps {
  icon: ReactNode;
  label: string;
  count: number;
  color: string;
}

const StatusCard = ({ icon, label, count, color }: StatusCardProps) => {
  const getActionsByLabel = () => {
    switch (label) {
      case "Aguardando":
        return [
          { label: "Iniciar Arte", action: () => console.log("Iniciar Arte") },
          { label: "Cancelar Pedido", action: () => console.log("Cancelar Pedido") }
        ];
      case "Arte":
        return [
          { label: "Aprovar Arte", action: () => console.log("Aprovar Arte") },
          { label: "Solicitar Alterações", action: () => console.log("Solicitar Alterações") }
        ];
      case "Produção":
        return [
          { label: "Finalizar Produção", action: () => console.log("Finalizar Produção") },
          { label: "Reportar Problema", action: () => console.log("Reportar Problema") }
        ];
      case "Finalizado":
        return [
          { label: "Enviar para Expedição", action: () => console.log("Enviar para Expedição") }
        ];
      case "Expedição":
        return [
          { label: "Confirmar Entrega", action: () => console.log("Confirmar Entrega") }
        ];
      case "Entregue":
        return [
          { label: "Ver Detalhes da Entrega", action: () => console.log("Ver Detalhes") }
        ];
      case "Cancelado":
        return [
          { label: "Ver Motivo", action: () => console.log("Ver Motivo") },
          { label: "Reativar Pedido", action: () => console.log("Reativar Pedido") }
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200 animate-fade-in cursor-pointer">
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-lg", color)}>{icon}</div>
            <div>
              <p className="text-sm text-gray-600">{label}</p>
              <h3 className="text-2xl font-semibold mt-1">{count}</h3>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={cn("p-2 rounded-lg", color)}>{icon}</span>
            {label}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Quantidade total: {count}</h4>
            <p className="text-sm text-gray-500">
              Selecione uma ação para os itens em status {label.toLowerCase()}
            </p>
          </div>
          
          <div className="grid gap-2">
            {getActionsByLabel().map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start"
                onClick={action.action}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusCard;