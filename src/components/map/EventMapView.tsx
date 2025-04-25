
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
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-10rem)]">
      <div className="flex-grow w-full md:w-3/4">
        <MapContainer 
          userLocation={userLocation}
          events={events}
          selectedTypes={selectedTypes}
        />
      </div>
      
      <div className="w-full md:w-1/4">
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
