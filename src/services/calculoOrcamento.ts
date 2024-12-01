import { 
  ItemOrcamento, 
  CustoMaterial, 
  Acabamento, 
  CustoOperacional, 
  ConfiguracaoImposto,
  MargemLucro 
} from '../types/orcamento';

export class CalculoOrcamentoService {
  // Calcula o custo total dos materiais
  static calcularCustoMateriais(materiais: CustoMaterial[]): number {
    return materiais.reduce((total, material) => {
      const custoComDesperdicio = material.precoUnitario * material.quantidade * (1 + material.desperdicio / 100);
      return total + custoComDesperdicio;
    }, 0);
  }

  // Calcula o custo total dos acabamentos
  static calcularCustoAcabamentos(acabamentos: Acabamento[]): number {
    return acabamentos.reduce((total, acabamento) => {
      return total + acabamento.custo;
    }, 0);
  }

  // Calcula o custo operacional total
  static calcularCustoOperacional(custosOperacionais: CustoOperacional[]): number {
    return custosOperacionais.reduce((total, custo) => {
      return total + (custo.valorHora * custo.tempoEstimado);
    }, 0);
  }

  // Calcula o valor dos impostos
  static calcularImpostos(valorBase: number, impostos: ConfiguracaoImposto[]): number {
    return impostos.reduce((total, imposto) => {
      return total + (valorBase * (imposto.porcentagem / 100));
    }, 0);
  }

  // Calcula a margem de lucro
  static calcularMargemLucro(custoTotal: number, margem: MargemLucro): number {
    if (margem.tipo === 'sobre_custo') {
      return custoTotal * (margem.porcentagem / 100);
    } else { // sobre_venda
      const fator = 1 - (margem.porcentagem / 100);
      return (custoTotal / fator) - custoTotal;
    }
  }

  // Calcula o preço de venda unitário
  static calcularPrecoVendaUnitario(item: ItemOrcamento): number {
    // Calcula o custo total unitário
    const custoMateriais = this.calcularCustoMateriais(item.materiais);
    const custoAcabamentos = this.calcularCustoAcabamentos(item.acabamentos);
    const custoOperacional = this.calcularCustoOperacional(item.custosOperacionais);
    
    const custoTotalUnitario = (custoMateriais + custoAcabamentos + custoOperacional) / item.quantidade;
    
    // Calcula a margem de lucro
    const margemLucro = this.calcularMargemLucro(custoTotalUnitario, item.margemLucro);
    
    // Calcula o preço base (custo + margem)
    const precoBase = custoTotalUnitario + margemLucro;
    
    // Calcula os impostos
    const impostos = this.calcularImpostos(precoBase, item.impostos);
    
    // Retorna o preço final
    return precoBase + impostos;
  }

  // Calcula todos os valores do item do orçamento
  static calcularItem(item: ItemOrcamento): ItemOrcamento {
    // Calcula o custo unitário
    const custoMateriais = this.calcularCustoMateriais(item.materiais);
    const custoAcabamentos = this.calcularCustoAcabamentos(item.acabamentos);
    const custoOperacional = this.calcularCustoOperacional(item.custosOperacionais);
    
    const custoTotalUnitario = (custoMateriais + custoAcabamentos + custoOperacional) / item.quantidade;
    
    // Calcula o preço unitário
    const precoUnitario = this.calcularPrecoVendaUnitario(item);
    
    // Calcula o preço total
    const precoTotal = precoUnitario * item.quantidade;
    
    return {
      ...item,
      custoUnitario: custoTotalUnitario,
      precoUnitario,
      precoTotal
    };
  }

  // Calcula área em m² para produtos que usam dimensões
  static calcularArea(largura?: number, altura?: number): number {
    if (!largura || !altura) return 0;
    return (largura * altura) / 10000; // converte de cm² para m²
  }

  // Calcula o tempo total de produção do item
  static calcularTempoProdução(custosOperacionais: CustoOperacional[]): number {
    return custosOperacionais.reduce((total, custo) => {
      return total + custo.tempoEstimado;
    }, 0);
  }

  // Calcula a margem de contribuição
  static calcularMargemContribuicao(precoVenda: number, custoTotal: number): number {
    return ((precoVenda - custoTotal) / precoVenda) * 100;
  }
}
