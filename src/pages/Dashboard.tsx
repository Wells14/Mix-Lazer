import { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  Group,
  Inventory
} from '@mui/icons-material';
import { DashboardService } from '@/services/DashboardService';
import { DashboardData } from '@/types/dashboard';
import { formatCurrency } from '@/lib/utils';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const dashboardData = await DashboardService.getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Erro ao carregar dados</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Card de Vendas */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>Vendas</Typography>
              </Box>
              <Typography variant="h4">{formatCurrency(data.vendas.total)}</Typography>
              <Typography variant="body2" color="text.secondary">
                {data.vendas.quantidade} vendas este mês
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card de Estoque */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Inventory color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>Estoque</Typography>
              </Box>
              <Typography variant="h4">{data.estoque.total}</Typography>
              <Typography variant="body2" color="text.secondary">
                {data.estoque.produtosBaixoEstoque} produtos em baixa
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card de Clientes */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Group color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>Clientes</Typography>
              </Box>
              <Typography variant="h4">{data.clientes.total}</Typography>
              <Typography variant="body2" color="text.secondary">
                {data.clientes.novos} novos este mês
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card de Produtos */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingCart color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>Produtos</Typography>
              </Box>
              <Typography variant="h4">{data.produtos.total}</Typography>
              <Typography variant="body2" color="text.secondary">
                {data.produtos.maisVendidos.length} mais vendidos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
