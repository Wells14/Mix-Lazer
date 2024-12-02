import { useEffect, useState } from 'react';
import {
    RelatorioVendas,
    RelatorioProdutos,
    RelatorioClientes,
    RelatorioFinanceiro,
    FiltrosRelatorio
} from '@/types/relatorio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatarMoeda } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RelatorioPreviewProps {
    dados: RelatorioVendas | RelatorioProdutos | RelatorioClientes | RelatorioFinanceiro;
    filtros: FiltrosRelatorio;
}

export function RelatorioPreview({ dados, filtros }: RelatorioPreviewProps) {
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        prepararDadosGrafico();
    }, [dados]);

    const prepararDadosGrafico = () => {
        switch (filtros.tipo) {
            case 'vendas':
                const dadosVendas = dados as RelatorioVendas;
                setChartData(dadosVendas.porStatus.map(status => ({
                    nome: status.status,
                    valor: status.valor
                })));
                break;
            case 'produtos':
                const dadosProdutos = dados as RelatorioProdutos;
                setChartData(dadosProdutos.porCategoria.map(categoria => ({
                    nome: categoria.categoria,
                    valor: categoria.valor
                })));
                break;
            // Adicionar outros casos conforme necessário
        }
    };

    const renderizarConteudo = () => {
        switch (filtros.tipo) {
            case 'vendas':
                return renderizarPreviewVendas(dados as RelatorioVendas);
            case 'produtos':
                return renderizarPreviewProdutos(dados as RelatorioProdutos);
            case 'clientes':
                return renderizarPreviewClientes(dados as RelatorioClientes);
            case 'financeiro':
                return renderizarPreviewFinanceiro(dados as RelatorioFinanceiro);
            default:
                return null;
        }
    };

    const renderizarPreviewVendas = (dados: RelatorioVendas) => (
        <>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Resumo de Vendas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total de Vendas</p>
                            <p className="text-2xl font-bold">{dados.totais.quantidade}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Valor Total</p>
                            <p className="text-2xl font-bold">{formatarMoeda(dados.totais.valor)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Ticket Médio</p>
                            <p className="text-2xl font-bold">{formatarMoeda(dados.totais.ticketMedio)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Descontos</p>
                            <p className="text-2xl font-bold">{formatarMoeda(dados.totais.desconto)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {filtros.incluirGraficos && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Vendas por Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="nome" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="valor" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            {filtros.incluirDetalhes && (
                <Card>
                    <CardHeader>
                        <CardTitle>Detalhes por Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Quantidade</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dados.porStatus.map((status, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{status.status}</TableCell>
                                        <TableCell>{status.quantidade}</TableCell>
                                        <TableCell className="text-right">
                                            {formatarMoeda(status.valor)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </>
    );

    const renderizarPreviewProdutos = (dados: RelatorioProdutos) => (
        <>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Resumo de Produtos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total de Produtos</p>
                            <p className="text-2xl font-bold">{dados.totais.quantidade}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Valor em Estoque</p>
                            <p className="text-2xl font-bold">{formatarMoeda(dados.totais.valorEstoque)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Baixo Estoque</p>
                            <p className="text-2xl font-bold">{dados.totais.produtosBaixoEstoque}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {dados.baixoEstoque.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Produtos com Baixo Estoque</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produto</TableHead>
                                    <TableHead>Estoque Atual</TableHead>
                                    <TableHead>Estoque Mínimo</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dados.baixoEstoque.map((produto, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{produto.nome}</TableCell>
                                        <TableCell>{produto.estoqueAtual}</TableCell>
                                        <TableCell>{produto.estoqueMinimo}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </>
    );

    const renderizarPreviewClientes = (dados: RelatorioClientes) => (
        <>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Resumo de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total de Clientes</p>
                            <p className="text-2xl font-bold">{dados.totais.quantidade}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                            <p className="text-2xl font-bold">{dados.totais.ativos}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Clientes Inativos</p>
                            <p className="text-2xl font-bold">{dados.totais.inativos}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {filtros.incluirDetalhes && dados.maioresCompradores.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Maiores Compradores</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Quantidade de Compras</TableHead>
                                    <TableHead className="text-right">Valor Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dados.maioresCompradores.map((cliente, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{cliente.nome}</TableCell>
                                        <TableCell>{cliente.quantidadeCompras}</TableCell>
                                        <TableCell className="text-right">
                                            {formatarMoeda(cliente.valorTotal)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </>
    );

    const renderizarPreviewFinanceiro = (dados: RelatorioFinanceiro) => (
        <>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Receita Total</p>
                            <p className="text-2xl font-bold">{formatarMoeda(dados.receitas.total)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total de Descontos</p>
                            <p className="text-2xl font-bold">{formatarMoeda(dados.descontos.total)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Ticket Médio</p>
                            <p className="text-2xl font-bold">{formatarMoeda(dados.indicadores.ticketMedio)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {filtros.incluirDetalhes && dados.receitas.porFormaPagamento.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Receitas por Forma de Pagamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Forma de Pagamento</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                    <TableHead className="text-right">Percentual</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dados.receitas.porFormaPagamento.map((forma, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{forma.forma}</TableCell>
                                        <TableCell className="text-right">
                                            {formatarMoeda(forma.valor)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {forma.percentual.toFixed(2)}%
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </>
    );

    return (
        <div className="space-y-6">
            {renderizarConteudo()}
        </div>
    );
}
