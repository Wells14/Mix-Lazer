import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ProductForm from "@/components/Products/ProductForm";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  description: string;
}

const Products = () => {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  
  // Temporary mock data - will be replaced with actual database integration
  const products: Product[] = [
    {
      id: "1",
      name: "Banner 440g",
      category: "Impressão Digital",
      basePrice: 45.00,
      description: "Banner em lona 440g com acabamento"
    },
    {
      id: "2",
      name: "Armário Planejado",
      category: "Móveis",
      basePrice: 1200.00,
      description: "Armário sob medida em MDF"
    }
  ];

  const handleAddProduct = () => {
    setShowForm(true);
  };

  const handleProductSaved = () => {
    setShowForm(false);
    toast({
      title: "Produto salvo com sucesso",
      description: "O produto foi adicionado ao catálogo"
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Catálogo de Produtos</h1>
        <Button onClick={handleAddProduct}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <ScrollArea className="h-[600px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço Base</TableHead>
              <TableHead>Descrição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>R$ {product.basePrice.toFixed(2)}</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {showForm && (
        <ProductForm onSave={handleProductSaved} onCancel={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default Products;