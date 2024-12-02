import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import { Cliente, Produto, MaterialProduto, ResultadoCalculo } from '../types/calculos';

const steps = ['Dados do Cliente', 'Produto', 'Materiais', 'Custos', 'Resultado'];

export default function OrcamentoForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [cliente, setCliente] = useState<Cliente>({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
  });

  const [produto, setProduto] = useState<Produto>({
    nome: '',
    descricao: '',
    quantidade: 1,
  });

  const [materiais, setMateriais] = useState<MaterialProduto[]>([]);
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    // Implementar integração com CalculoPrecoService
    handleNext();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome"
                value={cliente.nome}
                onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={cliente.email}
                onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefone"
                value={cliente.telefone}
                onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Empresa"
                value={cliente.empresa}
                onChange={(e) => setCliente({ ...cliente, empresa: e.target.value })}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Produto"
                value={produto.nome}
                onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descrição"
                value={produto.descricao}
                onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Quantidade"
                value={produto.quantidade}
                onChange={(e) => setProduto({ ...produto, quantidade: Number(e.target.value) })}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            {materiais.map((material, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Nome do Material"
                          value={material.nome}
                          onChange={(e) => {
                            const newMateriais = [...materiais];
                            newMateriais[index].nome = e.target.value;
                            setMateriais(newMateriais);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Quantidade"
                          value={material.quantidade}
                          onChange={(e) => {
                            const newMateriais = [...materiais];
                            newMateriais[index].quantidade = Number(e.target.value);
                            setMateriais(newMateriais);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Preço Unitário"
                          value={material.precoUnitario}
                          onChange={(e) => {
                            const newMateriais = [...materiais];
                            newMateriais[index].precoUnitario = Number(e.target.value);
                            setMateriais(newMateriais);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={() =>
                  setMateriais([
                    ...materiais,
                    { nome: '', quantidade: 0, precoUnitario: 0 },
                  ])
                }
              >
                Adicionar Material
              </Button>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Typography>
            Implementar formulário de custos (mão de obra, operacional, etc.)
          </Typography>
        );

      case 4:
        return resultado ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Resumo do Orçamento
                </Typography>
                <Typography>
                  Custo Total: R$ {resultado.custoTotal.toFixed(2)}
                </Typography>
                <Typography>
                  Preço Final: R$ {resultado.precoFinal.toFixed(2)}
                </Typography>
                <Typography>
                  Margem de Lucro: {resultado.margemLucro.percentual}%
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Typography>Calculando resultado...</Typography>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Novo Orçamento
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep > 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Voltar
              </Button>
            )}
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            >
              {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
