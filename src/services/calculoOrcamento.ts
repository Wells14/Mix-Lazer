import { 
  ItemOrcamento, 
  CustoMaterial, 
  Acabamento, 
  CustoOperacional, 
  ConfiguracaoImposto,
  MargemLucro,
  Orcamento
} from '../types/orcamento';

export class CalculoOrcamentoService {
  // Calcula o custo total dos materiais
  static calcularCustoMaterial(materiais: CustoMaterial[]): number {
    return materiais.reduce((total, material) => {
      return total + material.custoTotal;
    }, 0);
  }

  // Calcula o custo total dos acabamentos
  static calcularCustoAcabamento(acabamentos: Acabamento[]): number {
    return acabamentos.reduce((total, acabamento) => {
      return total + acabamento.custoTotal;
    }, 0);
  }

  // Calcula o custo operacional total
  static calcularCustoOperacional(custosOperacionais: CustoOperacional[]): number {
    return custosOperacionais.reduce((total, custo) => {
      return total + custo.custoTotal;
    }, 0);
  }

  // Calcula a margem de lucro
  static calcularMargemLucro(custoTotal: number, margemLucro: MargemLucro): number {
    if (margemLucro.tipo === 'sobre_custo') {
      return (custoTotal * margemLucro.porcentagem) / 100;
    } else {
      return (custoTotal / (1 - margemLucro.porcentagem / 100)) - custoTotal;
    }
  }

  // Calcula o custo do item
  static calcularCustoItem(item: ItemOrcamento): number {
    const custoMaterial = this.calcularCustoMaterial(item.custoMaterial || []);
    const custoAcabamento = this.calcularCustoAcabamento(item.acabamentos || []);
    const custoOperacional = this.calcularCustoOperacional(item.custoOperacional || []);

    return custoMaterial + custoAcabamento + custoOperacional;
  }

  // Calcula o preço do item
  static calcularPrecoItem(item: ItemOrcamento): number {
    const custoTotal = this.calcularCustoItem(item);
    const margemLucro = item.margemLucro ? this.calcularMargemLucro(custoTotal, item.margemLucro) : 0;

    return custoTotal + margemLucro;
  }

  // Calcula o total do orçamento
  static calcularTotalOrcamento(orcamento: Orcamento): number {
    const subtotal = orcamento.itens.reduce((total, item) => {
      return total + this.calcularPrecoItem(item);
    }, 0);

    const descontos = orcamento.descontos || 0;
    const impostos = orcamento.impostos || 0;

    return subtotal - descontos + impostos;
  }

  // Calcula o custo total do orçamento
  static calcularCustoTotalOrcamento(orcamento: Orcamento): number {
    return orcamento.itens.reduce((total, item) => {
      return total + this.calcularCustoItem(item);
    }, 0);
  }

  // Calcula a margem de lucro total do orçamento
  static calcularMargemLucroTotalOrcamento(orcamento: Orcamento): number {
    const custoTotal = this.calcularCustoTotalOrcamento(orcamento);
    const total = this.calcularTotalOrcamento(orcamento);

    return total - custoTotal;
  }

  // Calcula a margem de contribuição do orçamento
  static calcularMargemContribuicaoOrcamento(orcamento: Orcamento): number {
    const total = this.calcularTotalOrcamento(orcamento);
    const custoTotal = this.calcularCustoTotalOrcamento(orcamento);

    return ((total - custoTotal) / total) * 100;
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
