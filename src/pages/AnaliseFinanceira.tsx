import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const faturamentoData = [
  { mes: 'Jan', receita: 50000, custos: 30000, lucro: 20000 },
  { mes: 'Fev', receita: 55000, custos: 32000, lucro: 23000 },
  { mes: 'Mar', receita: 60000, custos: 35000, lucro: 25000 },
  { mes: 'Abr', receita: 65000, custos: 37000, lucro: 28000 },
  { mes: 'Mai', receita: 70000, custos: 40000, lucro: 30000 },
  { mes: 'Jun', receita: 75000, custos: 42000, lucro: 33000 },
];

const custosData = [
  { name: 'Materiais', value: 40 },
  { name: 'Mão de Obra', value: 30 },
  { name: 'Operacional', value: 20 },
  { name: 'Outros', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnaliseFinanceira() {
  const indicadoresFinanceiros = [
    {
      titulo: 'Receita Total',
      valor: 'R$ 375.000',
      comparacao: '+15% vs período anterior',
    },
    {
      titulo: 'Lucro Líquido',
      valor: 'R$ 159.000',
      comparacao: '+20% vs período anterior',
    },
    {
      titulo: 'Margem de Lucro',
      valor: '42.4%',
      comparacao: '+2.5pp vs período anterior',
    },
    {
      titulo: 'Ticket Médio',
      valor: 'R$ 5.000',
      comparacao: '+10% vs período anterior',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Análise Financeira
      </Typography>

      <Grid container spacing={3}>
        {indicadoresFinanceiros.map((indicador) => (
          <Grid item xs={12} sm={6} md={3} key={indicador.titulo}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {indicador.titulo}
                </Typography>
                <Typography variant="h5" component="div">
                  {indicador.valor}
                </Typography>
                <Typography variant="body2" color="success.main">
                  {indicador.comparacao}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Evolução Financeira
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={faturamentoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="receita"
                      stroke="#8884d8"
                      name="Receita"
                    />
                    <Line
                      type="monotone"
                      dataKey="custos"
                      stroke="#82ca9d"
                      name="Custos"
                    />
                    <Line
                      type="monotone"
                      dataKey="lucro"
                      stroke="#ffc658"
                      name="Lucro"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribuição de Custos
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={custosData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {custosData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Análise Detalhada
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Mês</TableCell>
                      <TableCell align="right">Receita</TableCell>
                      <TableCell align="right">Custos</TableCell>
                      <TableCell align="right">Lucro</TableCell>
                      <TableCell align="right">Margem</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {faturamentoData.map((row) => (
                      <TableRow key={row.mes}>
                        <TableCell component="th" scope="row">
                          {row.mes}
                        </TableCell>
                        <TableCell align="right">
                          R$ {row.receita.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          R$ {row.custos.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          R$ {row.lucro.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          {((row.lucro / row.receita) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
