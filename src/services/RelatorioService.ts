import {
    FiltrosRelatorio,
    RelatorioVendas,
    RelatorioProdutos,
    RelatorioClientes,
    RelatorioFinanceiro
} from '@/types/relatorio';
import { VendaService } from './VendaService';
import { ProdutoService } from './ProdutoService';
import { ClienteService } from './ClienteService';
import { LogService } from './LogService';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { parse } from 'json2csv';

export class RelatorioService {
    static async gerarRelatorio(filtros: FiltrosRelatorio): Promise<Blob> {
        try {
            let dados: any;

            // Busca os dados específicos do tipo de relatório
            switch (filtros.tipo) {
                case 'vendas':
                    dados = await this.gerarDadosVendas(filtros);
                    break;
                case 'produtos':
                    dados = await this.gerarDadosProdutos(filtros);
                    break;
                case 'clientes':
                    dados = await this.gerarDadosClientes(filtros);
                    break;
                case 'financeiro':
                    dados = await this.gerarDadosFinanceiros(filtros);
                    break;
                default:
                    throw new Error('Tipo de relatório inválido');
            }

            // Gera o arquivo no formato especificado
            switch (filtros.formato) {
                case 'pdf':
                    return await this.gerarPDF(dados, filtros);
                case 'excel':
                    return await this.gerarExcel(dados, filtros);
                case 'csv':
                    return await this.gerarCSV(dados, filtros);
                default:
                    throw new Error('Formato de relatório inválido');
            }
        } catch (error) {
            LogService.log('error', 'Erro ao gerar relatório', { error, filtros });
            throw new Error('Não foi possível gerar o relatório');
        }
    }

    static async gerarDadosRelatorio(filtros: FiltrosRelatorio) {
        try {
            switch (filtros.tipo) {
                case 'vendas':
                    return await this.gerarDadosVendas(filtros);
                case 'produtos':
                    return await this.gerarDadosProdutos(filtros);
                case 'clientes':
                    return await this.gerarDadosClientes(filtros);
                case 'financeiro':
                    return await this.gerarDadosFinanceiros(filtros);
                default:
                    throw new Error('Tipo de relatório inválido');
            }
        } catch (error) {
            LogService.log('error', 'Erro ao gerar dados do relatório', { error, filtros });
            throw new Error('Não foi possível gerar os dados do relatório');
        }
    }

    private static async gerarDadosVendas(filtros: FiltrosRelatorio): Promise<RelatorioVendas> {
        const vendas = await VendaService.listarVendas({
            dataInicio: filtros.dataInicio,
            dataFim: filtros.dataFim
        });

        // Calcula estatísticas
        const stats = await VendaService.calcularEstatisticas(
            filtros.dataInicio,
            filtros.dataFim
        );

        // Agrupa vendas por status
        const porStatus = vendas.reduce((acc: any[], venda) => {
            const statusGroup = acc.find(g => g.status === venda.status);
            if (statusGroup) {
                statusGroup.quantidade++;
                statusGroup.valor += venda.total;
            } else {
                acc.push({
                    status: venda.status,
                    quantidade: 1,
                    valor: venda.total
                });
            }
            return acc;
        }, []);

        // Agrupa vendas por cliente
        const porCliente = vendas.reduce((acc: any[], venda) => {
            const clienteGroup = acc.find(g => g.clienteId === venda.clienteId);
            if (clienteGroup) {
                clienteGroup.quantidade++;
                clienteGroup.valor += venda.total;
            } else {
                acc.push({
                    clienteId: venda.clienteId,
                    nomeCliente: venda.nomeCliente,
                    quantidade: 1,
                    valor: venda.total
                });
            }
            return acc;
        }, []);

        // Agrupa vendas por produto
        const porProduto = vendas.reduce((acc: any[], venda) => {
            venda.itens.forEach(item => {
                const produtoGroup = acc.find(g => g.produtoId === item.produtoId);
                if (produtoGroup) {
                    produtoGroup.quantidade += item.quantidade;
                    produtoGroup.valor += item.precoTotal;
                } else {
                    acc.push({
                        produtoId: item.produtoId,
                        nomeProduto: item.nomeProduto,
                        quantidade: item.quantidade,
                        valor: item.precoTotal
                    });
                }
            });
            return acc;
        }, []);

        return {
            periodo: {
                inicio: filtros.dataInicio || '',
                fim: filtros.dataFim || ''
            },
            totais: {
                quantidade: stats.quantidade,
                valor: stats.total,
                desconto: stats.totalDesconto,
                ticketMedio: stats.ticketMedio
            },
            porStatus,
            porCliente,
            porProduto
        };
    }

    private static async gerarDadosProdutos(filtros: FiltrosRelatorio): Promise<RelatorioProdutos> {
        const produtos = await ProdutoService.listarProdutos();
        
        // Implementar lógica de agrupamento e cálculos para produtos
        return {
            totais: {
                quantidade: produtos.length,
                valorEstoque: produtos.reduce((sum, p) => sum + (p.precoVenda * p.estoque), 0),
                produtosBaixoEstoque: produtos.filter(p => p.estoque <= p.estoqueMinimo).length
            },
            porCategoria: [],
            maisVendidos: [],
            menosVendidos: [],
            baixoEstoque: produtos
                .filter(p => p.estoque <= p.estoqueMinimo)
                .map(p => ({
                    produtoId: p.id,
                    nome: p.nome,
                    estoqueAtual: p.estoque,
                    estoqueMinimo: p.estoqueMinimo
                }))
        };
    }

    private static async gerarDadosClientes(filtros: FiltrosRelatorio): Promise<RelatorioClientes> {
        const clientes = await ClienteService.listarClientes();
        
        // Implementar lógica de agrupamento e cálculos para clientes
        return {
            totais: {
                quantidade: clientes.length,
                ativos: clientes.filter(c => c.ativo).length,
                inativos: clientes.filter(c => !c.ativo).length
            },
            porRegiao: [],
            maioresCompradores: [],
            ultimasCompras: []
        };
    }

    private static async gerarDadosFinanceiros(filtros: FiltrosRelatorio): Promise<RelatorioFinanceiro> {
        const vendas = await VendaService.listarVendas({
            dataInicio: filtros.dataInicio,
            dataFim: filtros.dataFim
        });

        // Implementar lógica de agrupamento e cálculos financeiros
        return {
            periodo: {
                inicio: filtros.dataInicio || '',
                fim: filtros.dataFim || ''
            },
            receitas: {
                total: vendas.reduce((sum, v) => sum + v.total, 0),
                porFormaPagamento: [],
                porPeriodo: []
            },
            descontos: {
                total: vendas.reduce((sum, v) => sum + v.desconto, 0),
                porPeriodo: []
            },
            indicadores: {
                ticketMedio: 0,
                taxaConversao: 0,
                crescimento: 0
            }
        };
    }

    private static async gerarPDF(dados: any, filtros: FiltrosRelatorio): Promise<Blob> {
        const doc = new jsPDF();
        
        // Adiciona título
        doc.setFontSize(16);
        doc.text(`Relatório de ${filtros.tipo}`, 14, 15);

        // Adiciona período se aplicável
        if (filtros.dataInicio && filtros.dataFim) {
            doc.setFontSize(10);
            doc.text(
                `Período: ${new Date(filtros.dataInicio).toLocaleDateString()} a ${new Date(
                    filtros.dataFim
                ).toLocaleDateString()}`,
                14,
                25
            );
        }

        // Adiciona conteúdo específico para cada tipo de relatório
        let y = 35;
        switch (filtros.tipo) {
            case 'vendas':
                this.adicionarConteudoVendasPDF(doc, dados, y);
                break;
            case 'produtos':
                this.adicionarConteudoProdutosPDF(doc, dados, y);
                break;
            case 'clientes':
                this.adicionarConteudoClientesPDF(doc, dados, y);
                break;
            case 'financeiro':
                this.adicionarConteudoFinanceiroPDF(doc, dados, y);
                break;
        }

        return new Blob([doc.output('blob')], { type: 'application/pdf' });
    }

    private static async gerarExcel(dados: any, filtros: FiltrosRelatorio): Promise<Blob> {
        // Prepara as planilhas de acordo com o tipo de relatório
        const sheets: { [key: string]: any[][] } = {};

        switch (filtros.tipo) {
            case 'vendas':
                sheets['Resumo'] = [
                    ['Total de Vendas', 'Valor Total', 'Ticket Médio', 'Descontos'],
                    [
                        dados.totais.quantidade,
                        dados.totais.valor,
                        dados.totais.ticketMedio,
                        dados.totais.desconto
                    ]
                ];
                sheets['Por Status'] = [
                    ['Status', 'Quantidade', 'Valor'],
                    ...dados.porStatus.map((s: any) => [s.status, s.quantidade, s.valor])
                ];
                break;
            // Implementar outros tipos de relatório
        }

        // Cria o workbook
        const wb = XLSX.utils.book_new();
        
        // Adiciona as planilhas
        Object.entries(sheets).forEach(([name, data]) => {
            const ws = XLSX.utils.aoa_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, name);
        });

        // Gera o arquivo
        const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
        return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }

    private static async gerarCSV(dados: any, filtros: FiltrosRelatorio): Promise<Blob> {
        // Prepara os dados para CSV de acordo com o tipo de relatório
        let fields: string[] = [];
        let data: any[] = [];

        switch (filtros.tipo) {
            case 'vendas':
                fields = ['Status', 'Quantidade', 'Valor'];
                data = dados.porStatus;
                break;
            // Implementar outros tipos de relatório
        }

        const csv = parse(data, { fields });
        return new Blob([csv], { type: 'text/csv' });
    }

    private static adicionarConteudoVendasPDF(doc: any, dados: RelatorioVendas, startY: number) {
        // Adiciona totais
        doc.setFontSize(12);
        doc.text('Resumo', 14, startY);
        
        const totais = [
            ['Total de Vendas:', dados.totais.quantidade.toString()],
            ['Valor Total:', `R$ ${dados.totais.valor.toFixed(2)}`],
            ['Ticket Médio:', `R$ ${dados.totais.ticketMedio.toFixed(2)}`],
            ['Total Descontos:', `R$ ${dados.totais.desconto.toFixed(2)}`]
        ];

        (doc as any).autoTable({
            startY: startY + 5,
            head: [],
            body: totais,
            theme: 'plain',
            margin: { left: 14 }
        });

        // Adiciona vendas por status
        const statusY = (doc as any).lastAutoTable.finalY + 10;
        doc.text('Vendas por Status', 14, statusY);

        (doc as any).autoTable({
            startY: statusY + 5,
            head: [['Status', 'Quantidade', 'Valor']],
            body: dados.porStatus.map(s => [
                s.status,
                s.quantidade.toString(),
                `R$ ${s.valor.toFixed(2)}`
            ]),
            margin: { left: 14 }
        });
    }

    private static adicionarConteudoProdutosPDF(doc: any, dados: RelatorioProdutos, startY: number) {
        // Implementar formatação específica para relatório de produtos
    }

    private static adicionarConteudoClientesPDF(doc: any, dados: RelatorioClientes, startY: number) {
        // Implementar formatação específica para relatório de clientes
    }

    private static adicionarConteudoFinanceiroPDF(doc: any, dados: RelatorioFinanceiro, startY: number) {
        // Implementar formatação específica para relatório financeiro
    }
}
