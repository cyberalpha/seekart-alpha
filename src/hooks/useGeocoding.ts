
import { useState } from 'react';
import { MAPBOX_PUBLIC_TOKEN } from '@/config/tokens';

export const useGeocoding = () => {
  const [loading, setLoading] = useState(false);

  const getCoordinates = async (
    address: string,
    city: string,
    state: string,
    country: string,
    locality: string,
    crossStreet1: string,
    crossStreet2: string
  ) => {
    try {
      setLoading(true);
      
      // Construir la consulta de búsqueda basada en los datos disponibles
      // Comenzamos con el país como mínimo requerido
      let locationParts: string[] = [];
      
      // Añadimos partes disponibles en orden jerárquico
      if (address) locationParts.push(address);
      if (locality) locationParts.push(locality);
      if (city) locationParts.push(city);
      if (state) locationParts.push(state);
      if (country) locationParts.push(country);
      
      // Añadimos calles de referencia si ambas están disponibles
      if (crossStreet1 && crossStreet2) {
        locationParts.splice(1, 0, `between ${crossStreet1} and ${crossStreet2}`);
      }
      
      const searchQuery = locationParts.join(', ');
      
      if (!searchQuery) {
        setLoading(false);
        return null;
      }

      // Ajustamos los tipos de búsqueda según el nivel de detalle
      let types = 'country';
      if (state) types = 'region';
      if (city) types = 'place';
      if (address || locality) types = 'address,neighborhood,poi';

      // Solicitud de geocodificación 
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` + 
        new URLSearchParams({
          access_token: MAPBOX_PUBLIC_TOKEN,
          limit: '1',
          types: types,
          autocomplete: 'false'
        })
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        const precision = data.features[0].relevance || 0;
        return { latitude, longitude, precision };
      }

      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getCoordinates, loading };
};
