import { ItemOrcamento, Orcamento } from './orcamento';

export interface Imposto {
  nome: string;
  aliquota: number;
  base: 'valor_total' | 'valor_produtos' | 'valor_servicos';
}

export interface LogCalculo {
  id: string;
  timestamp: Date;
  tipo: string;
  valores: Record<string, number>;
  resultado: number;
  usuario?: string;
}

export interface RelatorioMargemProduto {
  produto: ItemOrcamento;
  custoTotal: number;
  precoVenda: number;
  margemLucro: number;
  margemContribuicao: number;
}

export interface AnaliseCustomPeriodo {
  periodo: {
    inicio: Date;
    fim: Date;
  };
  custoTotal: number;
  custoMedio: number;
  custoPorCategoria: Record<string, number>;
}

export interface ProjecaoFinanceira {
  periodo: {
    inicio: Date;
    fim: Date;
  };
  receitaProjetada: number;
  custoProjetado: number;
  margemProjetada: number;
  crescimentoEsperado: number;
}

export interface ComparativoOrcamentos {
  orcamentos: Orcamento[];
  diferencaCustos: number;
  diferencaPrecos: number;
  diferencaMargens: number;
  recomendacoes?: string[];
}

export interface CacheConfig {
  ttl: number; // Time to live em segundos
  maxSize: number; // Tamanho máximo do cache
}
