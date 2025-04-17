
import { useState } from 'react';
import { ArtTypeId } from './types';
import { EventFilters } from './EventFilters';
import { MapContainer } from './MapContainer';
import { useLocationData } from './hooks/useLocationData';
import { artTypes } from './data';
import { artTypeMapping } from './types';

export const EventMapView = () => {
  const [radius, setRadius] = useState<number[]>([20]);
  const [selectedTypes, setSelectedTypes] = useState<ArtTypeId[]>([]);
  const { userLocation, events, isLoading } = useLocationData();

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] gap-4">
      <MapContainer 
        userLocation={userLocation}
        radius={radius}
        events={events}
        selectedTypes={selectedTypes}
      />
      
      <EventFilters 
        radius={radius}
        setRadius={setRadius}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        artTypes={artTypes}
      />
    </div>
  );
};

export default EventMapView;
