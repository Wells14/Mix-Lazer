import { CacheService } from './CacheService';
import { LogService } from './LogService';
import { 
    CustoMaterial, 
    CustoAcabamento, 
    CustoOperacional, 
    MargemLucro, 
    ResultadoCalculo,
    Imposto 
} from '../types/calculos';

export class CalculoService {
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
            
            return total + (acabamento.custoMetroQuadrado * acabamento.areaTotal);
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
        
        const custoTotal = (custoOp.custoHora * custoOp.tempoProducao) + custoOp.custoFixo;

        LogService.registrarCalculo('custoOperacional', { 
            custoHora: custoOp.custoHora,
            tempoProducao: custoOp.tempoProducao,
            custoFixo: custoOp.custoFixo,
            custoTotal 
        }, custoTotal);
        
        CacheService.setCached(cacheKey, custoTotal);

        return custoTotal;
    }

    static calcularImpostos(valor: number, impostos: Imposto[]): number {
        const cacheKey = CacheService.generateKey('impostos', { valor, impostos });
        const cached = CacheService.getCached(cacheKey);
        
        if (cached !== undefined) {
            return cached;
        }

        this.validarValores(valor, 'Valor base para cálculo de impostos');

        const totalImpostos = impostos.reduce((total, imposto) => {
            return total + (valor * (imposto.aliquota / 100));
        }, 0);

        LogService.registrarCalculo('impostos', { valorBase: valor, totalImpostos }, totalImpostos);
        CacheService.setCached(cacheKey, totalImpostos);

        return totalImpostos;
    }

    static calcularPrecoFinal(
        materiais: CustoMaterial[],
        acabamentos: CustoAcabamento[],
        custoOp: CustoOperacional,
        margemLucro: MargemLucro,
        impostos: Imposto[]
    ): ResultadoCalculo {
        const custoMateriais = this.calcularCustoMateriais(materiais);
        const custoAcabamento = this.calcularCustoAcabamento(acabamentos);
        const custoOperacional = this.calcularCustoOperacional(custoOp);
        
        const custoTotal = custoMateriais + custoAcabamento + custoOperacional;
        const valorMargemLucro = custoTotal * (margemLucro.percentual / 100);
        const valorImpostos = this.calcularImpostos(custoTotal + valorMargemLucro, impostos);
        
        const precoFinal = custoTotal + valorMargemLucro + valorImpostos;
        const margemContribuicao = precoFinal - custoTotal;

        const resultado: ResultadoCalculo = {
            custoTotal,
            margemLucro: valorMargemLucro,
            impostos: valorImpostos,
            precoFinal,
            margemContribuicao
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
