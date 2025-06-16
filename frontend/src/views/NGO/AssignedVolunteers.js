import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Avatar, 
  Chip,
  CircularProgress,
  Button,
  Alert,
  MenuItem,
  FormControl,
  Select,
  InputLabel
} from '@mui/material';
import { VolunteerActivism } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getVolunteers } from '../../models/VolunteerModel';
import { fetchVolunteers } from '../../services/api';

export default function AssignedVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('name');

  useEffect(() => {
  const loadVolunteers = async () => {
    try {
      const data = await getVolunteers();
      console.log('Voluntários recebidos:', data); // <-- VERIFIQUE ISSO NO CONSOLE
      setVolunteers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  loadVolunteers();
}, []);

const sortVolunteers = (volunteers, option) => {
    const sorted = [...volunteers];
    if (option === 'name') {
      sorted.sort((a, b) => a.name?.localeCompare(b.name));
    } else if (option === 'date') {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.data_inscricao)); // Mais recente primeiro
    }
    return sorted;
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        <CircularProgress size={60} />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 2 }}>
        Erro ao carregar voluntários: {error}
      </Alert>
    );
  }

  const sortedVolunteers = sortVolunteers(volunteers, sortOption);

   return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        <VolunteerActivism sx={{ mr: 1, verticalAlign: 'middle' }} />
        Voluntários Associados ({volunteers.length})
      </Typography>

      <FormControl sx={{ mb: 3, minWidth: 240 }}>
        <InputLabel id="sort-label">Ordenar por</InputLabel>
        <Select
          labelId="sort-label"
          value={sortOption}
          label="Ordenar por"
          onChange={handleSortChange}
        >
          <MenuItem value="name">Nome (A-Z)</MenuItem>
          <MenuItem value="date">Data de Inscrição (mais recentes)</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        {sortedVolunteers.map((volunteer) => (
          <Grid item xs={12} md={6} key={volunteer.id}>
            <Card sx={{ 
              borderLeft: '4px solid', 
              borderColor: volunteer.status === 'approved' ? 'success.main' : 'warning.main',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)'
              }
            }}>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar sx={{ 
                      bgcolor: volunteer.status === 'approved' ? 'success.light' : 'warning.light',
                      color: 'white'
                    }}>
                      {volunteer.name?.[0] || '?'}
                    </Avatar>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6">{volunteer.name || 'Sem nome'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {volunteer.address || 'Sem endereço'}
                    </Typography>
                    <div style={{ marginTop: 8 }}>
                      {(volunteer.skills || []).slice(0, 3).map((skill) => (
                        <Chip 
                          key={skill}
                          label={skill}
                          size="small"
                          sx={{ mr: 1, mt: 1 }}
                          color="primary"
                        />
                      ))}
                    </div>
                  </Grid>
                  <Grid item>
                    <Button 
                      variant="contained"
                      color="secondary"
                      component={Link}
                      to={`/ngo/volunteer/${volunteer.id}`}
                      size="small"
                    >
                      Ver Detalhes
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {volunteers.length === 0 && (
        <Alert severity="info" sx={{ mt: 4 }}>
          Nenhum voluntário encontrado.
        </Alert>
      )}
    </div>
  );
}
