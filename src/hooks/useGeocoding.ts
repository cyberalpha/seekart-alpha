
import { useState } from 'react';
import { MAPBOX_PUBLIC_TOKEN } from '@/config/tokens';
import debounce from 'lodash/debounce';

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
      
      // Construct detailed search query
      const locationParts = [
        address,
        crossStreet1 && crossStreet2 ? `between ${crossStreet1} and ${crossStreet2}` : '',
        locality,
        city,
        state,
        country
      ].filter(Boolean);
      
      const searchQuery = locationParts.join(', ');
      
      if (!searchQuery) return null;

      // Add additional parameters for better precision
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` + 
        new URLSearchParams({
          access_token: MAPBOX_PUBLIC_TOKEN,
          limit: '1',
          types: 'address',
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

  // Debounce the geocoding function to prevent too many API calls
  const debouncedGetCoordinates = debounce(getCoordinates, 1000);

  return { getCoordinates: debouncedGetCoordinates, loading };
};
