import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { artTypes } from "./ArtistProfile";

type EventData = {
  id: string;
  title: string;
  description: string;
  date: string;
  address: string;
  city: string;
  cross_streets: string;
  locality: string;
  type: string;
  art_types?: string[];
  ticket_url: string | null;
  video_url: string | null;
  image_url: string;
  latitude: number;
  longitude: number;
  artist_id: string;
  created_at: string;
};

const EditEvent = () => {
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [crossStreets, setCrossStreets] = useState("");
  const [locality, setLocality] = useState("");
  const [eventType, setEventType] = useState("");
  const [selectedArtTypes, setSelectedArtTypes] = useState<string[]>([]);
  const [ticketUrl, setTicketUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/auth");
          return;
        }
        
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();
        
        if (error) throw error;
        
        const eventData = data as unknown as EventData;
        
        // Only let the artist edit their own events
        if (eventData.artist_id !== session.user.id) {
          navigate("/artist-profile");
          toast({
            variant: "destructive",
            title: "Acceso denegado",
            description: "No tienes permiso para editar este evento.",
          });
          return;
        }
        
        // Format date for datetime-local input
        const eventDate = new Date(eventData.date);
        const formattedDate = eventDate.toISOString().slice(0, 16);
        
        setTitle(eventData.title);
        setDescription(eventData.description);
        setDate(formattedDate);
        setAddress(eventData.address);
        setCity(eventData.city);
        setCrossStreets(eventData.cross_streets);
        setLocality(eventData.locality);
        setEventType(eventData.type);
        setSelectedArtTypes(eventData.art_types || []);
        setTicketUrl(eventData.ticket_url || "");
        setVideoUrl(eventData.video_url || "");
        setImageUrl(eventData.image_url);
        setLatitude(eventData.latitude.toString());
        setLongitude(eventData.longitude.toString());
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el evento. Inténtalo de nuevo más tarde.",
        });
        navigate("/artist-profile");
      }
    };

    fetchEvent();
  }, [eventId, navigate, toast]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `event-images/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from("events")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from("events")
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;
      setImageUrl(publicUrl);
      
      toast({
        title: "Imagen subida",
        description: "La imagen ha sido subida correctamente.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo subir la imagen. Inténtalo de nuevo más tarde.",
      });
    } finally {
      setUploading(false);
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

  const handleToggleArtType = (typeId: string) => {
    setSelectedArtTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (!imageUrl) {
        toast({
          variant: "destructive",
          title: "Imagen requerida",
          description: "Debes subir una imagen para el evento.",
        });
        return;
      }
      
      if (selectedArtTypes.length === 0) {
        toast({
          variant: "destructive",
          title: "Tipo de arte requerido",
          description: "Debes seleccionar al menos un tipo de arte para el evento.",
        });
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      const eventData = {
        title,
        description,
        date,
        address,
        city,
        cross_streets: crossStreets,
        locality,
        type: eventType,
        art_types: selectedArtTypes,
        ticket_url: ticketUrl || null,
        video_url: videoUrl || null,
        image_url: imageUrl,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };
      
      const { error } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", eventId);
      
      if (error) throw error;
      
      toast({
        title: "Evento actualizado",
        description: "Tu evento ha sido actualizado correctamente.",
      });
      
      navigate("/artist-profile");
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el evento. Inténtalo de nuevo más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center">Cargando evento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Editar Evento</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Información del Evento</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
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
                
                <div>
                  <Label htmlFor="eventType">Descripción del tipo de evento *</Label>
                  <Input
                    id="eventType"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    placeholder="Concierto, Exposición, Taller, etc."
                    required
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Ubicación *</Label>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
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
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="locality">Localidad</Label>
                      <Input
                        id="locality"
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="latitude">Latitud</Label>
                      <Input
                        id="latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="longitude">Longitud</Label>
                      <Input
                        id="longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        required
                      />
                    </div>
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
                
                <div>
                  <Label>Imagen del evento *</Label>
                  
                  <div className="mt-2 flex flex-col items-center space-y-4">
                    {imageUrl && (
                      <div className="aspect-video w-full overflow-hidden rounded-md">
                        <img
                          src={imageUrl}
                          alt="Vista previa"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div>
                      <Input
                        id="eventImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      <Label
                        htmlFor="eventImage"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#3498db] px-4 py-2 text-sm font-medium text-white hover:bg-[#2980b9]"
                      >
                        <Upload size={16} />
                        {uploading ? "Subiendo..." : "Cambiar imagen"}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/artist-profile")}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                
                <Button
                  type="submit"
                  disabled={loading || uploading}
                  className="bg-gradient-to-r from-[#e74c3c] to-[#9b59b6] hover:from-[#c0392b] hover:to-[#8e44ad]"
                >
                  {loading ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditEvent;
