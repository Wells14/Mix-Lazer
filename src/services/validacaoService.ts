export class ValidacaoService {
  static validarValorPositivo(valor: number, campo: string): void {
    if (valor < 0) {
      throw new Error(`${campo} não pode ser negativo`);
    }
  }

  static validarValorMaiorQueZero(valor: number, campo: string): void {
    if (valor <= 0) {
      throw new Error(`${campo} deve ser maior que zero`);
    }
  }

  static validarCampoObrigatorio<T>(valor: T | undefined | null, campo: string): void {
    if (valor === undefined || valor === null) {
      throw new Error(`${campo} é obrigatório`);
    }
  }

  static validarPorcentagem(valor: number, campo: string): void {
    if (valor < 0 || valor > 100) {
      throw new Error(`${campo} deve estar entre 0 e 100`);
    }
  }

  static validarDimensoes(largura?: number, altura?: number): void {
    if (largura !== undefined) {
      this.validarValorMaiorQueZero(largura, 'Largura');
    }
    if (altura !== undefined) {
      this.validarValorMaiorQueZero(altura, 'Altura');
    }
  }

  static validarQuantidade(quantidade: number): void {
    if (!Number.isInteger(quantidade)) {
      throw new Error('Quantidade deve ser um número inteiro');
    }
    this.validarValorMaiorQueZero(quantidade, 'Quantidade');
  }

  static validarPreco(preco: number, campo: string): void {
    this.validarValorMaiorQueZero(preco, campo);
    if (preco > 999999999) {
      throw new Error(`${campo} está muito alto`);
    }
  }
}
