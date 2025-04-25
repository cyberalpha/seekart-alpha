
import { useState } from 'react';
import { ArtTypeId } from './types';
import { EventFilters } from './EventFilters';
import { MapContainer } from './MapContainer';
import { useLocationData } from './hooks/useLocationData';
import { artTypes } from './data';

export const EventMapView = () => {
  const [selectedTypes, setSelectedTypes] = useState<ArtTypeId[]>([]);
  const { userLocation, events, isLoading } = useLocationData();

  return (
    <div className="relative h-[calc(100vh-5rem)]">
      <div className="h-full w-full">
        <MapContainer 
          userLocation={userLocation}
          events={events}
          selectedTypes={selectedTypes}
        />
      </div>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
        <EventFilters 
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          artTypes={artTypes}
        />
      </div>
    </div>
  );
};

export default EventMapView;
