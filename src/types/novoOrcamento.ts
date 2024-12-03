import { z } from 'zod';

export const novoOrcamentoSchema = z.object({
  data: z.date(),
  validade: z.date(),
  cliente: z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    telefone: z.string().min(1, 'Telefone é obrigatório'),
    endereco: z.string().optional()
  }),
  prazoEntrega: z.string().min(1, 'Prazo de entrega é obrigatório'),
  formaPagamento: z.string().min(1, 'Forma de pagamento é obrigatória'),
  observacoes: z.string().optional()
});

export type NovoOrcamentoFormData = z.infer<typeof novoOrcamentoSchema>;
