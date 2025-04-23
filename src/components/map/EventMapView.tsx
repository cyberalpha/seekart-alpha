
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
    <div className="flex flex-col h-[calc(100vh-14rem)] gap-4">
      <MapContainer 
        userLocation={userLocation}
        events={events}
        selectedTypes={selectedTypes}
      />
      
      <EventFilters 
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        artTypes={artTypes}
      />
    </div>
  );
};

export default EventMapView;
