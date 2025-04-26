import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { artTypes } from "@/pages/ArtistProfile";
import { EventFormProps } from "@/types/event";
import { EventImageUploader } from "./EventImageUploader";
import { EventLocationPicker } from "./EventLocationPicker";
import { EventBasicInfo } from "./EventBasicInfo";
import { EventLinks } from "./EventLinks";
import { useEventForm } from "@/hooks/useEventForm";

export const EventForm = ({ 
  initialData = {},
  onSubmit,
  submitButtonText,
  onCancel,
  loading,
  uploading
}: EventFormProps) => {
  const { formState, formSetters } = useEventForm(initialData);
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formState);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Evento</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <EventBasicInfo
            title={formState.title}
            setTitle={formSetters.setTitle}
            description={formState.description}
            setDescription={formSetters.setDescription}
            date={formState.date}
            setDate={formSetters.setDate}
          />
          
          <div>
            <Label>Tipo de arte *</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {artTypes.map(type => (
                <Badge 
                  key={type.id}
                  className={`cursor-pointer ${
                    formState.art_types.includes(type.id) 
                      ? type.color + ' text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => {
                    formSetters.setSelectedArtTypes(prev => {
                      if (prev.includes(type.id)) {
                        return prev.filter(id => id !== type.id);
                      } else {
                        return [...prev, type.id];
                      }
                    });
                  }}
                >
                  {type.name}
                </Badge>
              ))}
            </div>
          </div>
          
          <EventLocationPicker
            address={formState.address}
            setAddress={formSetters.setAddress}
            city={formState.city}
            setCity={formSetters.setCity}
            state={formState.state}
            setState={formSetters.setState}
            country={formState.country}
            setCountry={formSetters.setCountry}
            cross_street_1={formState.cross_street_1}
            setCrossStreet1={formSetters.setCrossStreet1}
            cross_street_2={formState.cross_street_2}
            setCrossStreet2={formSetters.setCrossStreet2}
            locality={formState.locality}
            setLocality={formSetters.setLocality}
            latitude={formState.latitude}
            setLatitude={formSetters.setLatitude}
            longitude={formState.longitude}
            setLongitude={formSetters.setLongitude}
          />
          
          <EventLinks
            ticketUrl={formState.ticket_url}
            setTicketUrl={formSetters.setTicketUrl}
            videoUrl={formState.video_url}
            setVideoUrl={formSetters.setVideoUrl}
          />
          
          <EventImageUploader
            imageUrl={formState.image_url}
            onImageUpload={async (e) => {
              if (e.target.files?.[0]) {
                formSetters.setImageUrl(URL.createObjectURL(e.target.files[0]));
              }
            }}
            uploading={uploading}
          />
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              disabled={loading || uploading}
              className="bg-gradient-to-r from-[#2ecc71] to-[#3498db] hover:from-[#27ae60] hover:to-[#2980b9]"
            >
              {loading ? "Creando..." : submitButtonText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
