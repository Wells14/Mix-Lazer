import { CalculoPrecoService } from './services/CalculoPrecoService';
import { AnaliseFinanceiraService } from './services/AnaliseFinanceiraService';
import { LogService } from './services/LogService';
import { 
    CustoMaterial, 
    CustoAcabamento, 
    CustoOperacional, 
    CustoMaoDeObra,
    Imposto,
    DespesaFixa,
    DespesaVariavel,
    Comissao,
    Desconto
} from './types/calculos';

// Exemplo de cálculo de preço de um móvel planejado

// 1. Materiais
const materiais: CustoMaterial[] = [
    {
        id: '1',
        nome: 'MDF Branco',
        precoUnitario: 150,
        quantidade: 5,
        unidadeMedida: 'm²',
        categoria: 'Madeira',
        fornecedor: 'Fornecedor A'
    },
    {
        id: '2',
        nome: 'Dobradiças',
        precoUnitario: 15,
        quantidade: 10,
        unidadeMedida: 'un',
        categoria: 'Ferragens',
        fornecedor: 'Fornecedor B'
    },
    {
        id: '3',
        nome: 'Puxadores',
        precoUnitario: 25,
        quantidade: 5,
        unidadeMedida: 'un',
        categoria: 'Acabamento',
        fornecedor: 'Fornecedor C'
    }
];

// 2. Acabamentos
const acabamentos: CustoAcabamento[] = [
    {
        id: '1',
        nome: 'Pintura UV',
        custoMetroQuadrado: 45,
        areaTotal: 10,
        descricao: 'Pintura UV branca',
        tempoAplicacao: 2
    },
    {
        id: '2',
        nome: 'Fita de Borda',
        custoMetroQuadrado: 5,
        areaTotal: 20,
        descricao: 'Fita de borda branca',
        tempoAplicacao: 1
    }
];

// 3. Custos Operacionais
const custoOperacional: CustoOperacional = {
    custoHora: 80,
    tempoProducao: 16,
    custoFixo: 500,
    custoVariavel: 200,
    depreciacao: 100,
    manutencao: 50,
    energia: 80,
    agua: 20,
    aluguel: 300,
    internet: 30,
    telefone: 20,
    marketing: 100,
    outros: 50
};

// 4. Mão de Obra
const maoDeObra: CustoMaoDeObra[] = [
    {
        id: '1',
        cargo: 'Marceneiro',
        custoHora: 50,
        horasTrabalhadas: 16,
        encargos: 68,
        beneficios: 200
    },
    {
        id: '2',
        cargo: 'Ajudante',
        custoHora: 25,
        horasTrabalhadas: 16,
        encargos: 68,
        beneficios: 150
    }
];

// 5. Impostos
const impostos: Imposto[] = [
    {
        nome: 'ICMS',
        aliquota: 18,
        base: 'valor_total',
        tipo: 'estadual',
        regime: 'simples'
    },
    {
        nome: 'ISS',
        aliquota: 5,
        base: 'valor_servicos',
        tipo: 'municipal',
        regime: 'simples'
    },
    {
        nome: 'PIS',
        aliquota: 0.65,
        base: 'valor_total',
        tipo: 'federal',
        regime: 'simples'
    },
    {
        nome: 'COFINS',
        aliquota: 3,
        base: 'valor_total',
        tipo: 'federal',
        regime: 'simples'
    }
];

// 6. Comissão do Vendedor
const comissao: Comissao = {
    vendedorId: '1',
    percentual: 5,
    baseCalculo: 'valor_total',
    valorMinimo: 100,
    valorMaximo: 1000
};

// 7. Desconto para Cliente
const desconto: Desconto = {
    tipo: 'percentual',
    valor: 5,
    motivoDesconto: 'Cliente Fidelidade',
    validadeInicio: new Date(),
    validadeFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
};

// 8. Despesas Fixas para Análise Financeira
const despesasFixas: DespesaFixa[] = [
    {
        id: '1',
        nome: 'Aluguel',
        valor: 2000,
        periodicidade: 'mensal',
        categoria: 'Infraestrutura'
    },
    {
        id: '2',
        nome: 'Salários Administrativos',
        valor: 5000,
        periodicidade: 'mensal',
        categoria: 'Pessoal'
    },
    {
        id: '3',
        nome: 'Seguro',
        valor: 1200,
        periodicidade: 'anual',
        categoria: 'Seguros'
    }
];

// 9. Despesas Variáveis para Análise Financeira
const despesasVariaveis: DespesaVariavel[] = [
    {
        id: '1',
        nome: 'Comissões',
        valor: 0,
        baseCalculo: 'vendas',
        percentual: 5,
        categoria: 'Vendas'
    },
    {
        id: '2',
        nome: 'Materiais de Consumo',
        valor: 0,
        baseCalculo: 'producao',
        percentual: 3,
        categoria: 'Produção'
    }
];

try {
    // Calcula o preço final do produto
    console.log('\nCálculo de Preço do Produto:');
    console.log('----------------------------');
    
    const resultado = CalculoPrecoService.calcularPrecoFinal(
        materiais,
        acabamentos,
        custoOperacional,
        maoDeObra,
        { percentual: 30, valorBase: 0, tipo: 'percentual' },
        impostos,
        comissao,
        desconto
    );

    console.log(`Custo de Materiais: R$ ${resultado.custoMateriais.toFixed(2)}`);
    console.log(`Custo de Acabamento: R$ ${resultado.custoAcabamento.toFixed(2)}`);
    console.log(`Custo Operacional: R$ ${resultado.custoOperacional.toFixed(2)}`);
    console.log(`Custo de Mão de Obra: R$ ${resultado.custoMaoDeObra.toFixed(2)}`);
    console.log(`Custo Total: R$ ${resultado.custoTotal.toFixed(2)}`);
    console.log(`Margem de Lucro: R$ ${resultado.margemLucro.toFixed(2)}`);
    console.log(`Impostos: R$ ${resultado.impostos.toFixed(2)}`);
    console.log(`Comissões: R$ ${resultado.comissoes?.toFixed(2) || '0.00'}`);
    console.log(`Descontos: R$ ${resultado.descontos?.toFixed(2) || '0.00'}`);
    console.log(`Preço Final: R$ ${resultado.precoFinal.toFixed(2)}`);
    console.log(`Preço Sugerido: R$ ${resultado.precoSugerido?.toFixed(2) || '0.00'}`);
    console.log(`Margem de Contribuição: R$ ${resultado.margemContribuicao.toFixed(2)}`);
    console.log(`Ponto Crítico: ${resultado.pontoCritico?.toFixed(2) || '0.00'} unidades`);
    console.log(`Lucratividade: ${resultado.lucratividade?.toFixed(2) || '0.00'}%`);
    console.log(`Rentabilidade: ${resultado.rentabilidade?.toFixed(2) || '0.00'}%`);
    console.log(`ROI: ${resultado.roi?.toFixed(2) || '0.00'}%`);

    // Realiza análise financeira
    console.log('\nAnálise Financeira:');
    console.log('------------------');
    
    const analiseFinanceira = AnaliseFinanceiraService.realizarAnaliseCompleta(
        100000, // Faturamento previsto mensal
        despesasFixas,
        despesasVariaveis,
        50000 // Investimento total
    );

    console.log(`Faturamento Previsto: R$ ${analiseFinanceira.faturamentoPrevisto.toFixed(2)}`);
    console.log(`Custos Fixos: R$ ${analiseFinanceira.custosFixos.toFixed(2)}`);
    console.log(`Custos Variáveis: R$ ${analiseFinanceira.custosVariaveis.toFixed(2)}`);
    console.log(`Margem de Contribuição: R$ ${analiseFinanceira.margemContribuicao.toFixed(2)}`);
    console.log(`Ponto de Equilíbrio: R$ ${analiseFinanceira.pontoEquilibrio.toFixed(2)}`);
    console.log(`Lucratividade: ${analiseFinanceira.lucratividade.toFixed(2)}%`);
    console.log(`Rentabilidade: ${analiseFinanceira.rentabilidade.toFixed(2)}%`);
    console.log(`Payback: ${analiseFinanceira.payback.toFixed(1)} meses`);
    console.log(`ROI: ${analiseFinanceira.roi.toFixed(2)}%`);

    console.log('\nHistórico de Cálculos:');
    console.log('-------------------');
    console.log(LogService.exportarLogs());

} catch (error) {
    if (error instanceof Error) {
        console.error('Erro ao calcular preço:', error.message);
    } else {
        console.error('Erro desconhecido ao calcular preço');
    }
}
