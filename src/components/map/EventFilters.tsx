
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
    setSelectedTypes(value as ArtTypeId[]);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
      <ToggleGroup 
        type="multiple" 
        variant="outline"
        value={selectedTypes as string[]}
        onValueChange={handleValueChange}
        className="flex flex-wrap justify-center gap-2"
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
              } bg-white`}
              aria-label={type.name}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{type.name}</span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
};
