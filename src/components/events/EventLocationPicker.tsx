
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LocationPickerMap } from "@/components/map/LocationPickerMap";
import { useGeocoding } from "@/hooks/useGeocoding";
import { useToast } from "@/components/ui/use-toast";

interface EventLocationPickerProps {
  address: string;
  setAddress: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  crossStreets: string;
  setCrossStreets: (value: string) => void;
  locality: string;
  setLocality: (value: string) => void;
  latitude: string;
  setLatitude: (value: string) => void;
  longitude: string;
  setLongitude: (value: string) => void;
}

export const EventLocationPicker = ({
  address,
  setAddress,
  city,
  setCity,
  crossStreets,
  setCrossStreets,
  locality,
  setLocality,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
}: EventLocationPickerProps) => {
  const { toast } = useToast();
  const { getCoordinates } = useGeocoding();

  const handleAddressChange = async () => {
    const coordinates = await getCoordinates(address, city, locality);
    
    if (coordinates) {
      setLatitude(coordinates.latitude.toString());
      setLongitude(coordinates.longitude.toString());
      
      toast({
        title: "Ubicación actualizada",
        description: "Las coordenadas se han actualizado según la dirección proporcionada.",
      });
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
          
          toast({
            title: "Ubicación obtenida",
            description: "Se ha obtenido tu ubicación actual.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            variant: "destructive",
            title: "Error de ubicación",
            description: "No se pudo obtener tu ubicación. Intenta ingresarla manualmente.",
          });
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Navegador no compatible",
        description: "Tu navegador no soporta geolocalización. Intenta ingresar la ubicación manualmente.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Label>Ubicación</Label>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (e.target.value && city) {
                handleAddressChange();
              }
            }}
          />
        </div>
        
        <div>
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              if (address && e.target.value) {
                handleAddressChange();
              }
            }}
          />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="crossStreets">Calles de referencia</Label>
          <Input
            id="crossStreets"
            value={crossStreets}
            onChange={(e) => setCrossStreets(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="locality">Localidad</Label>
          <Input
            id="locality"
            value={locality}
            onChange={(e) => {
              setLocality(e.target.value);
              if (address && city && e.target.value) {
                handleAddressChange();
              }
            }}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Vista previa de la ubicación</Label>
        <LocationPickerMap
          latitude={latitude}
          longitude={longitude}
          onLocationChange={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
        />
      </div>
      
      <Button
        type="button"
        variant="outline"
        onClick={handleGetCurrentLocation}
        className="flex items-center gap-2"
      >
        <MapPin size={16} />
        <span>Obtener ubicación actual</span>
      </Button>
    </div>
  );
};
