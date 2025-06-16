import React, { useState } from 'react';
import { useOpportunityController } from '../../controllers/OpportunityController';
import { Card, CardContent, Typography, Grid, TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function OpportunityList() {
  const { opportunities, loading, error, applyFilter } = useOpportunityController();
  const [filter, setFilter] = useState('');
  const [maxDistance, setMaxDistance] = useState('');

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  const filtered = applyFilter(filter, maxDistance ? parseFloat(maxDistance) : null);

  return (
    <div style={{ padding: 20 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Buscar oportunidades"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Distância máxima (km)"
            type="number"
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
            inputProps: { min: 0 },
            sx: {
              '& input[type=number]::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              '& input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              '& input[type=number]': {
                MozAppearance: 'textfield',
              },
            },
          }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {filtered
        .sort((a, b) => {
            if (a.distancia == null) return 1; 
            if (b.distancia == null) return -1;
            return a.distancia - b.distancia;
        })
        .map(opp => (
          <Grid item xs={12} md={6} key={opp.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{opp.titulo}</Typography>
                <Typography color="textSecondary">{opp.ong_nome}</Typography>
                <Typography>{opp.descricao}</Typography>

                {opp.distancia != null && (
                  <Typography sx={{ mt: 1 }} color="text.secondary">
                    Distância: {opp.distancia.toFixed(2)} km
                  </Typography>
                )}

                <Button 
                  component={Link} 
                  to={`/volunteer/opportunity/${opp.id}`}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Typography sx={{ mt: 4 }}>
          Nenhuma oportunidade encontrada com os filtros aplicados.
        </Typography>
      )}
    </div>
  );
}
