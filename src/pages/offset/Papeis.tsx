import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

export default function Papeis() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Papéis"
        description="Gerenciamento de papéis para impressão offset"
      />
      <Card className="p-6">
        {/* Conteúdo da página */}
      </Card>
    </div>
  );
}
