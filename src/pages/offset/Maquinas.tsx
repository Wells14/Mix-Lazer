import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

export default function Maquinas() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Máquinas"
        description="Gerenciamento de máquinas offset"
      />
      <Card className="p-6">
        {/* Conteúdo da página */}
      </Card>
    </div>
  );
}