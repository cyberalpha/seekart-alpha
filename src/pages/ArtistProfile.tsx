import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { UserRound, Upload, PlusCircle, Edit, Trash2, Facebook, Instagram, Link } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";

export const artTypes = [
  { id: "musica", name: "Música", color: "bg-[#2ecc71]" }, // Verde brillante
  { id: "teatro", name: "Teatro", color: "bg-[#f1c40f]" }, // Amarillo
  { id: "imagenes", name: "Imágenes y formas", color: "bg-[#e74c3c]" }, // Rojo
  { id: "letras", name: "Letras", color: "bg-[#3498db]" }, // Azul
  { id: "cine", name: "Cine", color: "bg-[#e67e22]" }, // Naranja
  { id: "otro", name: "Otro", color: "bg-[#9b59b6]" }, // Púrpura/Rosa
];

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  address: string;
  city: string;
  type: string;
  image_url: string;
};

type ArtistType = {
  id: string;
  name: string;
  color: string;
  selected: boolean;
};

type ArtistData = {
  created_at: string;
  description: string;
  facebook_url: string;
  follower_count: number;
  id: string;
  instagram_url: string;
  last_name: string;
  name: string;
  profile_image: string;
  linktree_url?: string;
  art_types?: string[];
};

const ArtistProfile = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linktreeUrl, setLinktreeUrl] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [editing, setEditing] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [artistTypes, setArtistTypes] = useState<ArtistType[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/auth");
          return;
        }
        
        const { data: artistData, error: artistError } = await supabase
          .from("artists")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (artistError) throw artistError;
        
        if (artistData) {
          const data = artistData as unknown as ArtistData;
          setName(data.name || "");
          setLastName(data.last_name || "");
          setDescription(data.description || "");
          setFacebookUrl(data.facebook_url || "");
          setInstagramUrl(data.instagram_url || "");
          setLinktreeUrl(data.linktree_url || "");
          setProfileImageUrl(data.profile_image || null);
          
          const types = data.art_types || [];
          setArtistTypes(
            artTypes.map(type => ({
              ...type,
              selected: types.includes(type.id)
            }))
          );
        }
        
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .eq("artist_id", session.user.id)
          .order("date", { ascending: false });
        
        if (eventsError) throw eventsError;
        
        setEvents(eventsData || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar tu perfil. Inténtalo de nuevo más tarde.",
        });
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      let imageUrl = profileImageUrl;
      if (profileImage) {
        imageUrl = await uploadProfileImage(session.user.id);
      }
      
      const selectedTypes = artistTypes
        .filter(type => type.selected)
        .map(type => type.id);
      
      const updates = {
        name,
        last_name: lastName,
        description,
        facebook_url: facebookUrl,
        instagram_url: instagramUrl,
        linktree_url: linktreeUrl,
        profile_image: imageUrl,
        art_types: selectedTypes,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from("artists")
        .update(updates)
        .eq("id", session.user.id);
      
      if (error) throw error;
      
      toast({
        title: "Perfil actualizado",
        description: "Tus datos se han actualizado correctamente.",
      });
      
      setEditing(false);
      setProfileImage(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar tu perfil. Inténtalo de nuevo más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    setProfileImage(file);
    
    const objectUrl = URL.createObjectURL(file);
    setProfileImageUrl(objectUrl);
  };

  const uploadProfileImage = async (userId: string): Promise<string | null> => {
    if (!profileImage) return profileImageUrl;
    
    try {
      setUploading(true);
      
      const fileExt = profileImage.name.split(".").pop();
      const filePath = `artist-profiles/${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, profileImage);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo subir la imagen. Inténtalo de nuevo más tarde.",
      });
      return profileImageUrl;
    } finally {
      setUploading(false);
    }
  };

  const handleToggleArtType = (index: number) => {
    const updatedTypes = [...artistTypes];
    updatedTypes[index].selected = !updatedTypes[index].selected;
    setArtistTypes(updatedTypes);
  };

  const handleCreateEvent = () => {
    navigate("/create-event");
  };

  const handleEditEvent = (eventId: string) => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este evento?");
      
      if (!confirmed) return;
      
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);
      
      if (error) throw error;
      
      setEvents(events.filter(event => event.id !== eventId));
      
      toast({
        title: "Evento eliminado",
        description: "El evento ha sido eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el evento. Inténtalo de nuevo más tarde.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Perfil de Artista</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="events">Mis Eventos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información del Artista</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-col gap-8 md:flex-row">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-32 w-32">
                        {profileImageUrl ? (
                          <AvatarImage src={profileImageUrl} alt="Foto de perfil" />
                        ) : (
                          <AvatarFallback className="bg-[#e74c3c] text-white">
                            <UserRound size={64} />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div>
                        <Input
                          id="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={uploading || !editing}
                          className="hidden"
                        />
                        {editing && (
                          <Label
                            htmlFor="profileImage"
                            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#3498db] px-4 py-2 text-sm font-medium text-white hover:bg-[#2980b9]"
                          >
                            <Upload size={16} />
                            {uploading ? "Subiendo..." : "Cambiar foto"}
                          </Label>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      {editing ? (
                        <>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="name">Nombre artístico o denominación</Label>
                              <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Apellido (opcional)</Label>
                              <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                              id="description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              rows={4}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Tipo de arte</Label>
                            <div className="flex flex-wrap gap-2">
                              {artistTypes.map((type, index) => (
                                <Badge 
                                  key={type.id}
                                  className={`cursor-pointer ${type.selected ? type.color + ' text-white' : 'bg-gray-200 text-gray-700'}`}
                                  onClick={() => handleToggleArtType(index)}
                                >
                                  {type.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                              <Label htmlFor="facebookUrl">Facebook URL</Label>
                              <Input
                                id="facebookUrl"
                                value={facebookUrl}
                                onChange={(e) => setFacebookUrl(e.target.value)}
                                placeholder="https://facebook.com/tu_perfil"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="instagramUrl">Instagram URL</Label>
                              <Input
                                id="instagramUrl"
                                value={instagramUrl}
                                onChange={(e) => setInstagramUrl(e.target.value)}
                                placeholder="https://instagram.com/tu_perfil"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="linktreeUrl">Linktree URL</Label>
                              <Input
                                id="linktreeUrl"
                                value={linktreeUrl}
                                onChange={(e) => setLinktreeUrl(e.target.value)}
                                placeholder="https://linktr.ee/tu_perfil"
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-4">
                            <Button
                              variant="outline"
                              onClick={() => setEditing(false)}
                              disabled={loading}
                            >
                              Cancelar
                            </Button>
                            
                            <Button
                              onClick={handleUpdateProfile}
                              disabled={loading}
                              className="bg-gradient-to-r from-[#e74c3c] to-[#9b59b6] hover:from-[#c0392b] hover:to-[#8e44ad]"
                            >
                              {loading ? "Guardando..." : "Guardar cambios"}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Nombre artístico</p>
                              <p className="text-lg font-medium">{name}</p>
                            </div>
                            
                            {lastName && (
                              <div>
                                <p className="text-sm font-medium text-gray-500">Apellido</p>
                                <p className="text-lg font-medium">{lastName}</p>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-500">Descripción</p>
                            <p className="text-base">{description}</p>
                          </div>
                          
                          {artistTypes.some(type => type.selected) && (
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-2">Tipo de arte</p>
                              <div className="flex flex-wrap gap-2">
                                {artistTypes
                                  .filter(type => type.selected)
                                  .map(type => (
                                    <Badge 
                                      key={type.id}
                                      className={`${type.color} text-white`}
                                    >
                                      {type.name}
                                    </Badge>
                                  ))
                                }
                              </div>
                            </div>
                          )}
                          
                          <div className="flex gap-4">
                            {facebookUrl && (
                              <a
                                href={facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#3498db] hover:text-[#2980b9]"
                                aria-label="Facebook"
                              >
                                <Facebook size={24} />
                              </a>
                            )}
                            
                            {instagramUrl && (
                              <a
                                href={instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#e74c3c] hover:text-[#c0392b]"
                                aria-label="Instagram"
                              >
                                <Instagram size={24} />
                              </a>
                            )}
                            
                            {linktreeUrl && (
                              <a
                                href={linktreeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#2ecc71] hover:text-[#27ae60]"
                                aria-label="Linktree"
                              >
                                <Link size={24} />
                              </a>
                            )}
                          </div>
                          
                          <div className="pt-4">
                            <Button
                              onClick={() => setEditing(true)}
                              className="bg-gradient-to-r from-[#e74c3c] to-[#9b59b6] hover:from-[#c0392b] hover:to-[#8e44ad]"
                            >
                              Editar perfil
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cambiar Contraseña</CardTitle>
                </CardHeader>
                <CardContent>
                  <PasswordChangeForm />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="events">
            <div className="mb-6 flex justify-between">
              <h2 className="text-2xl font-bold">Mis Eventos</h2>
              
              <Button
                onClick={handleCreateEvent}
                className="flex items-center gap-2 bg-gradient-to-r from-[#2ecc71] to-[#3498db] hover:from-[#27ae60] hover:to-[#2980b9]"
              >
                <PlusCircle size={16} />
                <span>Crear Evento</span>
              </Button>
            </div>
            
            {events.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="mb-4 text-center text-lg text-gray-500">
                    Aún no has creado eventos
                  </p>
                  <Button
                    onClick={handleCreateEvent}
                    className="bg-gradient-to-r from-[#2ecc71] to-[#3498db] hover:from-[#27ae60] hover:to-[#2980b9]"
                  >
                    Crear mi primer evento
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="mb-2 text-xl font-bold">{event.title}</h3>
                      
                      <p className="mb-2 text-sm text-gray-600">
                        {format(new Date(event.date), "dd/MM/yyyy HH:mm")}
                      </p>
                      
                      <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                        {event.description}
                      </p>
                      
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEvent(event.id)}
                          className="flex items-center gap-1"
                        >
                          <Edit size={14} />
                          <span>Editar</span>
                        </Button>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="flex items-center gap-1 bg-[#e74c3c] hover:bg-[#c0392b]"
                        >
                          <Trash2 size={14} />
                          <span>Eliminar</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArtistProfile;
