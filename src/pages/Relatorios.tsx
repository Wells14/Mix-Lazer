import { useState } from 'react';
import { RelatorioService } from '@/services/RelatorioService';
import { FiltrosRelatorio } from '@/types/relatorio';
import { RelatorioForm } from '@/components/Relatorios/RelatorioForm';
import { RelatorioPreview } from '@/components/Relatorios/RelatorioPreview';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Relatorios() {
    const [loading, setLoading] = useState(false);
    const [dados, setDados] = useState<any>(null);
    const [filtrosAtuais, setFiltrosAtuais] = useState<FiltrosRelatorio | null>(null);

    const handleGerarRelatorio = async (filtros: FiltrosRelatorio) => {
        try {
            setLoading(true);
            const blob = await RelatorioService.gerarRelatorio(filtros);
            
            // Atualiza o estado para mostrar a prévia
            setDados(await RelatorioService.gerarDadosRelatorio(filtros));
            setFiltrosAtuais(filtros);
            
            // Cria um URL para o blob
            const url = window.URL.createObjectURL(blob);
            
            // Cria um link temporário e simula o clique
            const link = document.createElement('a');
            link.href = url;
            
            // Define o nome do arquivo baseado no tipo e formato
            const timestamp = new Date().toISOString().split('T')[0];
            const extensao = filtros.formato === 'excel' ? 'xlsx' : filtros.formato;
            link.download = `relatorio_${filtros.tipo}_${timestamp}.${extensao}`;
            
            document.body.appendChild(link);
            link.click();
            
            // Limpa
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success('Relatório gerado com sucesso');
        } catch (error) {
            toast.error('Erro ao gerar relatório');
        } finally {
            setLoading(false);
        }
    };

    const handlePrevisualizar = async (filtros: FiltrosRelatorio) => {
        try {
            setLoading(true);
            const dados = await RelatorioService.gerarDadosRelatorio(filtros);
            setDados(dados);
            setFiltrosAtuais(filtros);
            toast.success('Prévia gerada com sucesso');
        } catch (error) {
            toast.error('Erro ao gerar prévia do relatório');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Relatórios</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <RelatorioForm 
                        onSubmit={handleGerarRelatorio} 
                        onPreview={handlePrevisualizar}
                        loading={loading} 
                    />
                </div>
                
                <div>
                    {dados && filtrosAtuais && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Prévia do Relatório</h2>
                                <Button
                                    variant="outline"
                                    onClick={() => handleGerarRelatorio(filtrosAtuais)}
                                    disabled={loading}
                                >
                                    Baixar Relatório
                                </Button>
                            </div>
                            <RelatorioPreview dados={dados} filtros={filtrosAtuais} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
