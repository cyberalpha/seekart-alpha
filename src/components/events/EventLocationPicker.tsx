
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LocationPickerMap } from "@/components/map/LocationPickerMap";
import { useGeocoding } from "@/hooks/useGeocoding";
import { useToast } from "@/components/ui/use-toast";
import { MAPBOX_PUBLIC_TOKEN } from "@/config/tokens";
import { useEffect } from "react";

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

  // Manejar la actualización progresiva de la ubicación
  useEffect(() => {
    if (country) {
      handleUpdateLocation();
    }
  }, [country, state, city, address]);

  const handleUpdateLocation = async () => {
    if (country) {
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
        
        // Solo mostrar toast cuando se actualiza con la dirección completa
        if (address) {
          toast({
            title: "Ubicación actualizada",
            description: `Precisión: ${Math.round(result.precision * 100)}%`,
            variant: result.precision > 0.8 ? "default" : "destructive"
          });
        }
      }
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

          // Realizar geocodificación inversa para obtener la dirección
          handleReverseGeocode(position.coords.latitude.toString(), position.coords.longitude.toString());
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

  const handleMapLocationSelect = async (lat: string, lng: string) => {
    setLatitude(lat);
    setLongitude(lng);
    handleReverseGeocode(lat, lng);
  };

  const handleReverseGeocode = async (lat: string, lng: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_PUBLIC_TOKEN}`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const location = data.features[0];
        const context = location.context || [];
        
        const addressParts = {
          address: location.address ? `${location.address} ${location.text}` : location.text,
          city: context.find((c: any) => c.id.startsWith('place.'))?.text || '',
          state: context.find((c: any) => c.id.startsWith('region.'))?.text || '',
          country: context.find((c: any) => c.id.startsWith('country.'))?.text || '',
          locality: context.find((c: any) => c.id.startsWith('neighborhood.'))?.text || '',
        };
        
        setCountry(addressParts.country);
        setState(addressParts.state);
        setCity(addressParts.city);
        setAddress(addressParts.address);
        setLocality(addressParts.locality);
        
        toast({
          title: "Ubicación seleccionada",
          description: "Los campos de dirección han sido actualizados.",
        });
      }
    } catch (error) {
      console.error("Error en geocodificación inversa:", error);
      toast({
        variant: "destructive",
        title: "Error de ubicación",
        description: "No se pudo obtener la dirección desde el mapa."
      });
    }
  };

  return (
    <div className="space-y-4">
      <Label>Ubicación</Label>
      
      <div className="grid gap-4">
        {/* País - 1er nivel jerárquico */}
        <div>
          <Label htmlFor="country" className="text-sm font-medium text-gray-700">País *</Label>
          <Input
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full"
            placeholder="Ej: Argentina"
            required
          />
        </div>
        
        {/* Estado/Provincia - 2do nivel jerárquico */}
        <div>
          <Label htmlFor="state" className="text-sm font-medium text-gray-700">Estado/Provincia</Label>
          <Input
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full"
            placeholder="Ej: Buenos Aires"
          />
        </div>

        {/* Ciudad - 3er nivel jerárquico */}
        <div>
          <Label htmlFor="city" className="text-sm font-medium text-gray-700">Ciudad</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full"
            placeholder="Ej: Buenos Aires"
          />
        </div>

        {/* Dirección - 4to nivel jerárquico */}
        <div>
          <Label htmlFor="address" className="text-sm font-medium text-gray-700">Dirección</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full"
            placeholder="Ej: Av. Principal 123"
          />
        </div>
        
        {/* Localidad/Barrio - 5to nivel jerárquico */}
        <div>
          <Label htmlFor="locality" className="text-sm font-medium text-gray-700">Localidad/Barrio</Label>
          <Input
            id="locality"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="w-full"
            placeholder="Ej: Palermo"
          />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Primera referencia - 6to nivel jerárquico */}
          <div>
            <Label htmlFor="crossStreet1" className="text-sm font-medium text-gray-700">1ª Referencia</Label>
            <Input
              id="crossStreet1"
              value={cross_street_1}
              onChange={(e) => setCrossStreet1(e.target.value)}
              className="w-full"
              placeholder="Ej: Calle 1"
            />
          </div>
          
          {/* Segunda referencia - 7mo nivel jerárquico */}
          <div>
            <Label htmlFor="crossStreet2" className="text-sm font-medium text-gray-700">2ª Referencia</Label>
            <Input
              id="crossStreet2"
              value={cross_street_2}
              onChange={(e) => setCrossStreet2(e.target.value)}
              className="w-full"
              placeholder="Ej: Calle 2"
            />
          </div>
        </div>
      </div>
      
      {/* Vista previa del mapa */}
      <div className="space-y-2 mt-4">
        <div className="flex items-center justify-between">
          <Label>Vista previa de la ubicación</Label>
          {loading && (
            <span className="text-xs text-gray-500 animate-pulse">
              Actualizando mapa...
            </span>
          )}
        </div>
        <LocationPickerMap
          latitude={latitude || "0"}
          longitude={longitude || "0"}
          onLocationChange={handleMapLocationSelect}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleGetCurrentLocation}
          className="flex items-center gap-2"
        >
          <MapPin size={16} />
          <span>Usar mi ubicación actual</span>
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => handleUpdateLocation()}
          disabled={!country || loading}
          className="flex items-center gap-2"
        >
          <MapPin size={16} />
          <span>Actualizar mapa desde dirección</span>
        </Button>
      </div>
    </div>
  );
};
