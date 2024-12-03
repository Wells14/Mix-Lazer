import { AnaliseFinanceira, DespesaFixa, DespesaVariavel } from '../types/calculos';
import { CacheService } from './CacheService';
import { LogService } from './LogService';

export class AnaliseFinanceiraService {
    static calcularPontoEquilibrio(
        custosFixos: number,
        precoVenda: number,
        custoVariavelUnitario: number
    ): number {
        const cacheKey = CacheService.generateKey('pontoEquilibrio', { 
            custosFixos, 
            precoVenda, 
            custoVariavelUnitario 
        });
        
        const cached = CacheService.getCached(cacheKey);
        if (cached !== undefined) {
            return cached;
        }

        const margemContribuicaoUnitaria = precoVenda - custoVariavelUnitario;
        const pontoEquilibrio = custosFixos / margemContribuicaoUnitaria;

        LogService.registrarCalculo('pontoEquilibrio', {
            custosFixos,
            precoVenda,
            custoVariavelUnitario,
            pontoEquilibrio
        }, pontoEquilibrio);

        CacheService.setCached(cacheKey, pontoEquilibrio);
        return pontoEquilibrio;
    }

    static calcularLucratividade(
        receitaTotal: number,
        custoTotal: number
    ): number {
        const cacheKey = CacheService.generateKey('lucratividade', { 
            receitaTotal, 
            custoTotal 
        });
        
        const cached = CacheService.getCached(cacheKey);
        if (cached !== undefined) {
            return cached;
        }

        const lucro = receitaTotal - custoTotal;
        const lucratividade = (lucro / receitaTotal) * 100;

        LogService.registrarCalculo('lucratividade', {
            receitaTotal,
            custoTotal,
            lucro,
            lucratividade
        }, lucratividade);

        CacheService.setCached(cacheKey, lucratividade);
        return lucratividade;
    }

    static calcularRentabilidade(
        lucroLiquido: number,
        investimentoTotal: number
    ): number {
        const cacheKey = CacheService.generateKey('rentabilidade', { 
            lucroLiquido, 
            investimentoTotal 
        });
        
        const cached = CacheService.getCached(cacheKey);
        if (cached !== undefined) {
            return cached;
        }

        const rentabilidade = (lucroLiquido / investimentoTotal) * 100;

        LogService.registrarCalculo('rentabilidade', {
            lucroLiquido,
            investimentoTotal,
            rentabilidade
        }, rentabilidade);

        CacheService.setCached(cacheKey, rentabilidade);
        return rentabilidade;
    }

    static calcularPayback(
        investimentoTotal: number,
        lucroMensalEstimado: number
    ): number {
        const cacheKey = CacheService.generateKey('payback', { 
            investimentoTotal, 
            lucroMensalEstimado 
        });
        
        const cached = CacheService.getCached(cacheKey);
        if (cached !== undefined) {
            return cached;
        }

        const paybackMeses = investimentoTotal / lucroMensalEstimado;

        LogService.registrarCalculo('payback', {
            investimentoTotal,
            lucroMensalEstimado,
            paybackMeses
        }, paybackMeses);

        CacheService.setCached(cacheKey, paybackMeses);
        return paybackMeses;
    }

    static calcularROI(
        lucroLiquido: number,
        investimentoTotal: number
    ): number {
        const cacheKey = CacheService.generateKey('roi', { 
            lucroLiquido, 
            investimentoTotal 
        });
        
        const cached = CacheService.getCached(cacheKey);
        if (cached !== undefined) {
            return cached;
        }

        const roi = (lucroLiquido / investimentoTotal) * 100;

        LogService.registrarCalculo('roi', {
            lucroLiquido,
            investimentoTotal,
            roi
        }, roi);

        CacheService.setCached(cacheKey, roi);
        return roi;
    }

    static calcularCustosFixosTotais(despesasFixas: DespesaFixa[]): number {
        return despesasFixas.reduce((total, despesa) => {
            let valorMensal = despesa.valor;
            
            switch (despesa.periodicidade) {
                case 'anual':
                    valorMensal = despesa.valor / 12;
                    break;
                case 'semanal':
                    valorMensal = despesa.valor * 4.33; // média de semanas no mês
                    break;
            }
            
            return total + valorMensal;
        }, 0);
    }

    static calcularCustosVariaveisTotais(
        despesasVariaveis: DespesaVariavel[],
        baseCalculo: number
    ): number {
        return despesasVariaveis.reduce((total, despesa) => {
            return total + (baseCalculo * (despesa.percentual / 100));
        }, 0);
    }

    static realizarAnaliseCompleta(
        faturamentoPrevisto: number,
        despesasFixas: DespesaFixa[],
        despesasVariaveis: DespesaVariavel[],
        investimentoTotal: number
    ): AnaliseFinanceira {
        const custosFixos = this.calcularCustosFixosTotais(despesasFixas);
        const custosVariaveis = this.calcularCustosVariaveisTotais(despesasVariaveis, faturamentoPrevisto);
        const margemContribuicao = faturamentoPrevisto - custosVariaveis;
        const lucroLiquido = margemContribuicao - custosFixos;
        
        const pontoEquilibrio = this.calcularPontoEquilibrio(
            custosFixos,
            faturamentoPrevisto,
            custosVariaveis / faturamentoPrevisto
        );
        
        const lucratividade = this.calcularLucratividade(faturamentoPrevisto, custosFixos + custosVariaveis);
        const rentabilidade = this.calcularRentabilidade(lucroLiquido, investimentoTotal);
        const payback = this.calcularPayback(investimentoTotal, lucroLiquido);
        const roi = this.calcularROI(lucroLiquido, investimentoTotal);

        return {
            faturamentoPrevisto,
            custosFixos,
            custosVariaveis,
            margemContribuicao,
            pontoEquilibrio,
            lucratividade,
            rentabilidade,
            payback,
            roi
        };
    }
}
