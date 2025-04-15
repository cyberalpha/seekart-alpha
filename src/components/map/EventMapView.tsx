
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const artTypes = [
  { id: 'music', name: 'Música', color: 'seekart-red' },
  { id: 'theater', name: 'Teatro', color: 'seekart-orange' },
  { id: 'dance', name: 'Danza', color: 'seekart-yellow' },
  { id: 'visual', name: 'Artes Visuales', color: 'seekart-green' },
  { id: 'literature', name: 'Literatura', color: 'seekart-blue' },
  { id: 'other', name: 'Otros', color: 'seekart-purple' },
];

export const EventMapView = () => {
  const [radius, setRadius] = useState([20]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!map) {
      const newMap = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-58.3816, -34.6037], // Buenos Aires
        zoom: 11,
        accessToken: 'pk.YOUR_MAPBOX_TOKEN' // Replace with your token
      });

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      setMap(newMap);
    }
  }, [map]);

  const toggleEventType = (typeId: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] gap-4">
      <div className="flex-1 relative">
        <div id="map" className="w-full h-full rounded-lg shadow-lg" />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Radio de búsqueda: {radius[0]} km
          </label>
          <Slider
            value={radius}
            onValueChange={setRadius}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {artTypes.map((type) => (
            <Button
              key={type.id}
              variant="outline"
              className={`transition-colors ${
                selectedTypes.includes(type.id)
                  ? `bg-${type.color} text-white`
                  : 'bg-transparent hover:bg-opacity-10'
              }`}
              onClick={() => toggleEventType(type.id)}
            >
              <MapPin className="h-4 w-4" />
              {type.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
