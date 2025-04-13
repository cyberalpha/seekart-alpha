
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { UserRound, Upload } from "lucide-react";

const FanProfile = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [editing, setEditing] = useState(false);
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
        
        const { data: fanData, error: fanError } = await supabase
          .from("fans")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (fanError) {
          console.error("Fan error:", fanError);
          if (fanError.code === 'PGRST116') {
            // Si no existe, crear un nuevo perfil de fan
            const { error: insertError } = await supabase
              .from("fans")
              .insert({
                id: session.user.id,
                name: session.user.user_metadata?.name || "Fan",
                last_name: session.user.user_metadata?.last_name || "",
                profile_image: null
              });
            
            if (insertError) throw insertError;
            
            setName(session.user.user_metadata?.name || "Fan");
            setLastName(session.user.user_metadata?.last_name || "");
            setProfileImageUrl(null);
          } else {
            throw fanError;
          }
        } else if (fanData) {
          setName(fanData.name || "");
          setLastName(fanData.last_name || "");
          setProfileImageUrl(fanData.profile_image || null);
        }
        
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
      
      // Primero subir la imagen si se cambió
      let imageUrl = profileImageUrl;
      if (profileImage) {
        imageUrl = await uploadProfileImage(session.user.id);
      }
      
      const updates = {
        name,
        last_name: lastName,
        profile_image: imageUrl,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from("fans")
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
    
    // Crear una vista previa
    const objectUrl = URL.createObjectURL(file);
    setProfileImageUrl(objectUrl);
  };

  const uploadProfileImage = async (userId: string): Promise<string | null> => {
    if (!profileImage) return profileImageUrl;
    
    try {
      setUploading(true);
      
      const fileExt = profileImage.name.split(".").pop();
      const filePath = `fan-profiles/${userId}/${Date.now()}.${fileExt}`;
      
      // Subir a storage
      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, profileImage);
      
      if (uploadError) throw uploadError;
      
      // Obtener URL pública
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Mi Perfil</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  {profileImageUrl ? (
                    <AvatarImage src={profileImageUrl} alt="Foto de perfil" />
                  ) : (
                    <AvatarFallback className="bg-[#f1c40f] text-white">
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
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
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
                        <p className="text-sm font-medium text-gray-500">Nombre</p>
                        <p className="text-lg font-medium">{name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Apellido</p>
                        <p className="text-lg font-medium">{lastName}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        onClick={() => setEditing(true)}
                        className="bg-gradient-to-r from-[#2ecc71] to-[#3498db] hover:from-[#27ae60] hover:to-[#2980b9]"
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
      </div>
    </div>
  );
};

export default FanProfile;
