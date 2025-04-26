
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LocationPickerMap } from "@/components/map/LocationPickerMap";
import { useGeocoding } from "@/hooks/useGeocoding";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface EventLocationPickerProps {
  address: string;
  setAddress: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  cross_street_1: string;
  setCrossStreet1: (value: string) => void;
  cross_street_2: string;
  setCrossStreet2: (value: string) => void;
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
  state,
  setState,
  country,
  setCountry,
  cross_street_1,
  setCrossStreet1,
  cross_street_2,
  setCrossStreet2,
  locality,
  setLocality,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
}: EventLocationPickerProps) => {
  const { toast } = useToast();
  const { getCoordinates, loading } = useGeocoding();

  const handleUpdateLocation = async () => {
    if (address && city && country) {
      const result = await getCoordinates(
        address,
        city,
        state,
        country,
        locality,
        cross_street_1,
        cross_street_2
      );

      if (result) {
        setLatitude(result.latitude.toString());
        setLongitude(result.longitude.toString());
        toast({
          title: "Ubicación actualizada",
          description: `Precisión: ${Math.round(result.precision * 100)}%`,
          variant: result.precision > 0.8 ? "default" : "warning"
        });
      }
    }
  };

  const handleAddressChange = async (value: string, setter: (value: string) => void) => {
    setter(value);
    await handleUpdateLocation();
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
    }
  };

  return (
    <div className="space-y-4">
      <Label>Ubicación</Label>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => handleAddressChange(e.target.value, setAddress)}
            className="w-full"
            placeholder="Ej: Av. Principal 123"
          />
        </div>
        
        <div>
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => handleAddressChange(e.target.value, setCity)}
            className="w-full"
            placeholder="Ej: Buenos Aires"
          />
        </div>

        <div>
          <Label htmlFor="state">Estado/Provincia</Label>
          <Input
            id="state"
            value={state}
            onChange={(e) => handleAddressChange(e.target.value, setState)}
            className="w-full"
            placeholder="Ej: Buenos Aires"
          />
        </div>

        <div>
          <Label htmlFor="country">País</Label>
          <Input
            id="country"
            value={country}
            onChange={(e) => handleAddressChange(e.target.value, setCountry)}
            className="w-full"
            placeholder="Ej: Argentina"
          />
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="crossStreet1">Primera calle de referencia</Label>
          <Input
            id="crossStreet1"
            value={cross_street_1}
            onChange={(e) => handleAddressChange(e.target.value, setCrossStreet1)}
            className="w-full"
            placeholder="Ej: Calle 1"
          />
        </div>
        
        <div>
          <Label htmlFor="crossStreet2">Segunda calle de referencia</Label>
          <Input
            id="crossStreet2"
            value={cross_street_2}
            onChange={(e) => handleAddressChange(e.target.value, setCrossStreet2)}
            className="w-full"
            placeholder="Ej: Calle 2"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="locality">Localidad/Barrio</Label>
          <Input
            id="locality"
            value={locality}
            onChange={(e) => handleAddressChange(e.target.value, setLocality)}
            className="w-full"
            placeholder="Ej: Palermo"
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
        disabled={loading}
      >
        <MapPin size={16} />
        <span>Obtener ubicación actual</span>
      </Button>
    </div>
  );
};
