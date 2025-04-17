
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArtType, ArtTypeId } from "./types";

interface EventFiltersProps {
  radius: number[];
  setRadius: (value: number[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (value: string[]) => void;
  artTypes: ArtType[];
}

export const EventFilters = ({
  radius,
  setRadius,
  selectedTypes,
  setSelectedTypes,
  artTypes
}: EventFiltersProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-seekart-purple/10">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Radio de búsqueda: {radius[0]} km
        </label>
        <Slider
          value={radius}
          onValueChange={(value) => {
            setRadius(value);
            console.log("Nuevo radio:", value[0]);
          }}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
      
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Tipos de eventos</h3>
        <ToggleGroup 
          type="multiple" 
          variant="outline"
          value={selectedTypes}
          onValueChange={(value) => {
            setSelectedTypes(value);
            console.log("Nuevos filtros:", value);
          }}
          className="flex flex-wrap gap-2"
        >
          {artTypes.map((type) => {
            const Icon = type.icon;
            return (
              <ToggleGroupItem 
                key={type.id} 
                value={type.id}
                className={`event-type-button event-type-button-${type.id} ${
                  selectedTypes.includes(type.id) ? 'selected' : ''
                }`}
                aria-label={type.name}
              >
                <Icon className="h-4 w-4" />
                <span>{type.name}</span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>
    </div>
  );
};
