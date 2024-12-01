import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrcamentosStore } from "@/stores/orcamentosStore";
import { toast } from "sonner";
import { X } from "lucide-react";

const formSchema = z.object({
  cliente: z.string().min(1, "Cliente é obrigatório"),
  status: z.string().min(1, "Status é obrigatório"),
  data: z.string().min(1, "Data é obrigatória"),
  entrega: z.string().min(1, "Data de entrega é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
});

interface OrcamentoFormProps {
  onClose: () => void;
}

export function OrcamentoForm({ onClose }: OrcamentoFormProps) {
  const { criarNovoOrcamento } = useOrcamentosStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente: "",
      status: "Novo Orçamento",
      data: new Date().toISOString().split("T")[0],
      entrega: "",
      valor: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const novoOrcamento = {
      status: values.status,
      data: values.data,
      cliente: values.cliente,
      entrega: values.entrega,
      valor: Number(values.valor),
      items: [] as Item[],  
    };

    criarNovoOrcamento(novoOrcamento);
    toast.success("Orçamento criado com sucesso!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Novo Orçamento</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Novo Orçamento">Novo Orçamento</SelectItem>
                      <SelectItem value="Aprovado">Aprovado</SelectItem>
                      <SelectItem value="Em Análise">Em Análise</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entrega"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Entrega</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-gray-200 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
