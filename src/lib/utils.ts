import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatarData(date: string | Date): string {
  if (!date) return '';
  const data = new Date(date);
  return new Intl.DateTimeFormat('pt-BR').format(data);
}

export const formatDate = formatarData;

export function formatarNumero(valor: number, decimais: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais
  }).format(valor);
}

export function formatarPorcentagem(valor: number, decimais: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais
  }).format(valor / 100);
}

export function formatarDataHora(data: string | Date): string {
  if (typeof data === 'string') {
    data = new Date(data);
  }
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(data);
}

export function calcularTotal(valores: number[]): number {
  return valores.reduce((total, valor) => total + valor, 0);
}

export function calcularMedia(valores: number[]): number {
  if (valores.length === 0) return 0;
  return calcularTotal(valores) / valores.length;
}

export function calcularPercentual(valor: number, total: number): number {
  if (total === 0) return 0;
  return (valor / total) * 100;
}

export function gerarId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function truncarTexto(texto: string, tamanho: number): string {
  if (texto.length <= tamanho) return texto;
  return texto.substring(0, tamanho) + '...';
}

export function removerAcentos(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function slugify(texto: string): string {
  return removerAcentos(texto)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

export function validarCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, '');
  if (cnpj.length !== 14) return false;
  
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  
  return true;
}

export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validarTelefone(telefone: string): boolean {
  telefone = telefone.replace(/[^\d]/g, '');
  return telefone.length >= 10 && telefone.length <= 11;
}

export function validarCEP(cep: string): boolean {
  cep = cep.replace(/[^\d]/g, '');
  return cep.length === 8;
}

export function formatarCPF(cpf: string): string {
  cpf = cpf.replace(/[^\d]/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatarCNPJ(cnpj: string): string {
  cnpj = cnpj.replace(/[^\d]/g, '');
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function formatarTelefone(telefone: string): string {
  telefone = telefone.replace(/[^\d]/g, '');
  if (telefone.length === 11) {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

export function formatarCEP(cep: string): string {
  cep = cep.replace(/[^\d]/g, '');
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}
