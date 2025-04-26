
import { useState } from 'react';
import { MAPBOX_PUBLIC_TOKEN } from '@/config/tokens';

export const useGeocoding = () => {
  const [loading, setLoading] = useState(false);

  const getCoordinates = async (address: string, city: string, locality: string) => {
    try {
      setLoading(true);
      
      // Construct search query
      const searchQuery = [address, city, locality]
        .filter(Boolean)
        .join(', ');
      
      if (!searchQuery) return null;

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_PUBLIC_TOKEN}&limit=1`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        return { latitude, longitude };
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
