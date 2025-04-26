
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { artTypes } from "@/pages/ArtistProfile";
import { EventImageUploader } from "./EventImageUploader";
import { EventLocationPicker } from "./EventLocationPicker";
import { EventFormData, EventFormProps } from "@/types/event";

export const EventForm = ({ 
  initialData = {},
  onSubmit,
  submitButtonText,
  onCancel,
  loading,
  uploading
}: EventFormProps) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [date, setDate] = useState(initialData.date || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [city, setCity] = useState(initialData.city || "");
  const [crossStreets, setCrossStreets] = useState(initialData.cross_streets || "");
  const [locality, setLocality] = useState(initialData.locality || "");
  const [selectedArtTypes, setSelectedArtTypes] = useState<string[]>(initialData.art_types || []);
  const [ticketUrl, setTicketUrl] = useState(initialData.ticket_url || "");
  const [videoUrl, setVideoUrl] = useState(initialData.video_url || "");
  const [imageUrl, setImageUrl] = useState(initialData.image_url || "");
  const [latitude, setLatitude] = useState(initialData.latitude || "");
  const [longitude, setLongitude] = useState(initialData.longitude || "");

  const handleToggleArtType = (typeId: string) => {
    setSelectedArtTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: EventFormData = {
      title,
      description,
      date,
      address,
      city,
      cross_streets: crossStreets,
      locality,
      type: selectedArtTypes[0] || "",
      art_types: selectedArtTypes,
      ticket_url: ticketUrl,
      video_url: videoUrl,
      image_url: imageUrl,
      latitude,
      longitude
    };

    await onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Evento</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título del evento *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="date">Fecha y hora *</Label>
              <Input
                id="date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label>Tipo de arte *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {artTypes.map(type => (
                  <Badge 
                    key={type.id}
                    className={`cursor-pointer ${
                      selectedArtTypes.includes(type.id) 
                        ? type.color + ' text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleToggleArtType(type.id)}
                  >
                    {type.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <EventLocationPicker
              address={address}
              setAddress={setAddress}
              city={city}
              setCity={setCity}
              crossStreets={crossStreets}
              setCrossStreets={setCrossStreets}
              locality={locality}
              setLocality={setLocality}
              latitude={latitude}
              setLatitude={setLatitude}
              longitude={longitude}
              setLongitude={setLongitude}
            />
            
            <div className="space-y-4">
              <Label>Enlaces opcionales</Label>
              
              <div>
                <Label htmlFor="ticketUrl">Enlace para comprar boletos</Label>
                <Input
                  id="ticketUrl"
                  type="url"
                  value={ticketUrl}
                  onChange={(e) => setTicketUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <Label htmlFor="videoUrl">Enlace de video</Label>
                <Input
                  id="videoUrl"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
            
            <EventImageUploader
              imageUrl={imageUrl}
              onImageUpload={async (e) => {
                if (e.target.files?.[0]) {
                  setImageUrl(URL.createObjectURL(e.target.files[0]));
                }
              }}
              uploading={uploading}
            />
          </div>
          
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
