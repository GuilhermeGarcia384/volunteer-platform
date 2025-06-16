import { useEffect, useState } from 'react';
import { fetchOpportunities } from '../services/api';

const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useOpportunityController = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Captura a localização do usuário
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (err) => {
        console.warn("Erro ao obter localização:", err);
      }
    );
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchOpportunities();
        setOpportunities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const applyFilter = (filterText, maxDistanceKm = null) => {
    return opportunities
    
    .map((opp) => {
    let distancia = null;
    if (userLocation && opp.latitude && opp.longitude) {
      distancia = calcularDistancia(
        userLocation.lat,
        userLocation.lon,
        parseFloat(opp.latitude),
        parseFloat(opp.longitude)
      );
    }
    return { ...opp, distancia };
  })
    
    
    .filter((opp) => {
      const matchText =
        opp.titulo.toLowerCase().includes(filterText.toLowerCase()) ||
        opp.ong_nome.toLowerCase().includes(filterText.toLowerCase());

      if (!maxDistanceKm || !userLocation || !opp.latitude || !opp.longitude) {
        return matchText;
      }

      const distancia = calcularDistancia(
        userLocation.lat,
        userLocation.lon,
        opp.latitude,
        opp.longitude
      );

      return matchText && distancia <= maxDistanceKm;
    });
  };

  return { opportunities, loading, error, applyFilter };
};
