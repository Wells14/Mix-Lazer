import { 
    CustoMaterial, 
    CustoAcabamento, 
    CustoOperacional,
    CustoMaoDeObra,
    MargemLucro,
    Imposto,
    Desconto,
    Comissao,
    ResultadoCalculo
} from '../types/calculos';
import { CacheService } from './CacheService';
import { LogService } from './LogService';

export class CalculoPrecoService {
    private static validarValores(valor: number, campo: string) {
        if (valor < 0) throw new Error(`${campo} não pode ser negativo`);
        if (valor === 0) throw new Error(`${campo} não pode ser zero`);
    }

    static calcularCustoMateriais(materiais: CustoMaterial[]): number {
        const cacheKey = CacheService.generateKey('custoMateriais', { materiais });
        const cached = CacheService.getCached(cacheKey);
        
        if (cached !== undefined) {
            return cached;
        }

        const custoTotal = materiais.reduce((total, material) => {
            this.validarValores(material.precoUnitario, `Preço unitário do material ${material.nome}`);
            this.validarValores(material.quantidade, `Quantidade do material ${material.nome}`);
            
            return total + (material.precoUnitario * material.quantidade);
        }, 0);

        LogService.registrarCalculo('custoMateriais', { custoTotal }, custoTotal);
        CacheService.setCached(cacheKey, custoTotal);

        return custoTotal;
    }

    static calcularCustoAcabamento(acabamentos: CustoAcabamento[]): number {
        const cacheKey = CacheService.generateKey('custoAcabamento', { acabamentos });
        const cached = CacheService.getCached(cacheKey);
        
        if (cached !== undefined) {
            return cached;
        }

        const custoTotal = acabamentos.reduce((total, acabamento) => {
            this.validarValores(acabamento.custoMetroQuadrado, `Custo por m² do acabamento ${acabamento.nome}`);
            this.validarValores(acabamento.areaTotal, `Área total do acabamento ${acabamento.nome}`);
            
            let custoAcabamento = acabamento.custoMetroQuadrado * acabamento.areaTotal;
            
            if (acabamento.tempoAplicacao) {
                custoAcabamento += acabamento.tempoAplicacao * 50; // Custo hora padrão de aplicação
            }
            
            return total + custoAcabamento;
        }, 0);

        LogService.registrarCalculo('custoAcabamento', { custoTotal }, custoTotal);
        CacheService.setCached(cacheKey, custoTotal);

        return custoTotal;
    }

    static calcularCustoOperacional(custoOp: CustoOperacional): number {
        const cacheKey = CacheService.generateKey('custoOperacional', { custoOp });
        const cached = CacheService.getCached(cacheKey);
        
        if (cached !== undefined) {
            return cached;
        }

        this.validarValores(custoOp.custoHora, 'Custo por hora');
        this.validarValores(custoOp.tempoProducao, 'Tempo de produção');
        
        let custoTotal = custoOp.custoHora * custoOp.tempoProducao + custoOp.custoFixo;
        
        // Adiciona outros custos operacionais se existirem
        if (custoOp.custoVariavel) custoTotal += custoOp.custoVariavel;
        if (custoOp.depreciacao) custoTotal += custoOp.depreciacao;
        if (custoOp.manutencao) custoTotal += custoOp.manutencao;
        if (custoOp.energia) custoTotal += custoOp.energia;
        if (custoOp.agua) custoTotal += custoOp.agua;
        if (custoOp.aluguel) custoTotal += custoOp.aluguel;
        if (custoOp.internet) custoTotal += custoOp.internet;
        if (custoOp.telefone) custoTotal += custoOp.telefone;
        if (custoOp.marketing) custoTotal += custoOp.marketing;
        if (custoOp.outros) custoTotal += custoOp.outros;

        LogService.registrarCalculo('custoOperacional', { 
            custoHora: custoOp.custoHora,
            tempoProducao: custoOp.tempoProducao,
            custoFixo: custoOp.custoFixo,
            custoTotal 
        }, custoTotal);
        
        CacheService.setCached(cacheKey, custoTotal);

        return custoTotal;
    }

    static calcularCustoMaoDeObra(custosMaoDeObra: CustoMaoDeObra[]): number {
        const cacheKey = CacheService.generateKey('custoMaoDeObra', { custosMaoDeObra });
        const cached = CacheService.getCached(cacheKey);
        
        if (cached !== undefined) {
            return cached;
        }

        const custoTotal = custosMaoDeObra.reduce((total, maoDeObra) => {
            this.validarValores(maoDeObra.custoHora, `Custo hora de ${maoDeObra.cargo}`);
            this.validarValores(maoDeObra.horasTrabalhadas, `Horas trabalhadas de ${maoDeObra.cargo}`);
            
            let custoBase = maoDeObra.custoHora * maoDeObra.horasTrabalhadas;
            let custoEncargos = custoBase * (maoDeObra.encargos / 100);
            let custoBeneficios = maoDeObra.beneficios || 0;
            
            return total + custoBase + custoEncargos + custoBeneficios;
        }, 0);

        LogService.registrarCalculo('custoMaoDeObra', { custoTotal }, custoTotal);
        CacheService.setCached(cacheKey, custoTotal);

        return custoTotal;
    }

    static calcularMargemLucro(custoTotal: number, margem: MargemLucro): number {
        const cacheKey = CacheService.generateKey('margemLucro', { custoTotal, margem });
        const cached = CacheService.getCached(cacheKey);
        
        if (cached !== undefined) {
            return cached;
        }

        let valorMargem = 0;

        if (margem.tipo === 'percentual') {
            valorMargem = custoTotal * (margem.percentual / 100);
        } else {
            valorMargem = margem.valorBase;
        }

        // Aplica limites se existirem
        if (margem.margemMinima && valorMargem < margem.margemMinima) {
            valorMargem = margem.margemMinima;
        }
        if (margem.margemMaxima && valorMargem > margem.margemMaxima) {
            valorMargem = margem.margemMaxima;
        }

        LogService.registrarCalculo('margemLucro', { 
            custoTotal,
            percentual: margem.percentual,
            valorMargem 
        }, valorMargem);

        CacheService.setCached(cacheKey, valorMargem);
        return valorMargem;
    }

    static calcularImpostos(valor: number, impostos: Imposto[]): number {
        const cacheKey = CacheService.generateKey('impostos', { valor, impostos });
        const cached = CacheService.getCached(cacheKey);
        
        if (cached !== undefined) {
            return cached;
        }

        this.validarValores(valor, 'Valor base para cálculo de impostos');

        const totalImpostos = impostos.reduce((total, imposto) => {
            if (imposto.isento) return total;
            return total + (valor * (imposto.aliquota / 100));
        }, 0);

        LogService.registrarCalculo('impostos', { 
            valorBase: valor, 
            totalImpostos 
        }, totalImpostos);

        CacheService.setCached(cacheKey, totalImpostos);
        return totalImpostos;
    }

    static calcularComissao(valor: number, comissao: Comissao): number {
        const valorComissao = valor * (comissao.percentual / 100);

        if (comissao.valorMinimo && valorComissao < comissao.valorMinimo) {
            return comissao.valorMinimo;
        }
        if (comissao.valorMaximo && valorComissao > comissao.valorMaximo) {
            return comissao.valorMaximo;
        }

        return valorComissao;
    }

    static aplicarDesconto(valor: number, desconto: Desconto): number {
        if (desconto.tipo === 'percentual') {
            return valor * (1 - desconto.valor / 100);
        }
        return valor - desconto.valor;
    }

    static calcularPrecoFinal(
        materiais: CustoMaterial[],
        acabamentos: CustoAcabamento[],
        custoOp: CustoOperacional,
        maoDeObra: CustoMaoDeObra[],
        margemLucro: MargemLucro,
        impostos: Imposto[],
        comissao?: Comissao,
        desconto?: Desconto
    ): ResultadoCalculo {
        // Calcula todos os custos
        const custoMateriais = this.calcularCustoMateriais(materiais);
        const custoAcabamento = this.calcularCustoAcabamento(acabamentos);
        const custoOperacional = this.calcularCustoOperacional(custoOp);
        const custoMaoDeObra = this.calcularCustoMaoDeObra(maoDeObra);
        
        const custoTotal = custoMateriais + custoAcabamento + custoOperacional + custoMaoDeObra;
        
        // Calcula margem de lucro
        const valorMargemLucro = this.calcularMargemLucro(custoTotal, margemLucro);
        
        // Calcula valor base para impostos
        let valorBase = custoTotal + valorMargemLucro;
        
        // Aplica desconto se houver
        let valorDesconto = 0;
        if (desconto) {
            valorDesconto = valorBase - this.aplicarDesconto(valorBase, desconto);
            valorBase = valorBase - valorDesconto;
        }
        
        // Calcula impostos
        const valorImpostos = this.calcularImpostos(valorBase, impostos);
        
        // Calcula comissão se houver
        let valorComissao = 0;
        if (comissao) {
            valorComissao = this.calcularComissao(valorBase, comissao);
        }
        
        // Calcula preço final
        const precoFinal = valorBase + valorImpostos + valorComissao;
        
        // Calcula margem de contribuição
        const margemContribuicao = precoFinal - custoTotal;
        
        // Calcula indicadores financeiros
        const lucratividade = (margemContribuicao / precoFinal) * 100;
        const rentabilidade = (margemContribuicao / custoTotal) * 100;
        
        // Calcula ponto crítico (break-even point)
        const pontoCritico = custoTotal / (1 - (margemContribuicao / precoFinal));
        
        // Calcula ROI
        const roi = (margemContribuicao / custoTotal) * 100;

        const resultado: ResultadoCalculo = {
            custoTotal,
            custoMateriais,
            custoAcabamento,
            custoOperacional,
            custoMaoDeObra,
            margemLucro: valorMargemLucro,
            impostos: valorImpostos,
            comissoes: valorComissao,
            descontos: valorDesconto,
            precoFinal,
            precoSugerido: precoFinal * 1.1, // Sugestão de preço 10% acima
            margemContribuicao,
            pontoCritico,
            lucratividade,
            rentabilidade,
            payback: custoTotal / margemContribuicao, // em unidades vendidas
            roi
        };

        LogService.registrarCalculo('precoFinal', {
            custoTotal: resultado.custoTotal,
            margemLucro: resultado.margemLucro,
            impostos: resultado.impostos,
            precoFinal: resultado.precoFinal,
            margemContribuicao: resultado.margemContribuicao
        }, precoFinal);

        return resultado;
    }
}
