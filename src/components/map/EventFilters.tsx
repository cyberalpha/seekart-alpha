
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArtType, ArtTypeId } from "./types";

interface EventFiltersProps {
  selectedTypes: ArtTypeId[];
  setSelectedTypes: (value: ArtTypeId[]) => void;
  artTypes: ArtType[];
}

export const EventFilters = ({
  selectedTypes,
  setSelectedTypes,
  artTypes
}: EventFiltersProps) => {
  const handleValueChange = (value: string[]) => {
    // Cast the string[] to ArtTypeId[]
    setSelectedTypes(value as ArtTypeId[]);
    console.log("Tipos seleccionados:", value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-seekart-purple/10 h-full">
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Tipos de eventos</h3>
        <ToggleGroup 
          type="multiple" 
          variant="outline"
          value={selectedTypes as string[]}
          onValueChange={handleValueChange}
          className="flex flex-wrap gap-2"
        >
          {artTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedTypes.includes(type.id);
            
            return (
              <ToggleGroupItem 
                key={type.id} 
                value={type.id}
                className={`event-type-button event-type-button-${type.id} ${
                  isSelected ? 'selected' : ''
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
