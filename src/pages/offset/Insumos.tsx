import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

export default function Insumos() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Insumos"
        description="Gerenciamento de insumos para impressão offset"
      />
      <Card className="p-6">
        {/* Conteúdo da página */}
      </Card>
    </div>
  );
}
