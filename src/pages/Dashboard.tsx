import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Dashboard"
        description="Bem-vindo ao Mix Laser Dashboard"
      />
      <Card className="p-6">
        {/* Conteúdo do Dashboard */}
      </Card>
    </div>
  );
}
