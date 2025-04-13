
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState("fan");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Validación básica de campos
        if (!name) {
          throw new Error("El nombre es requerido");
        }

        // Si es artista, validamos campos adicionales
        if (userType === "artist" && !description) {
          throw new Error("La descripción es requerida para artistas");
        }

        // Registrar usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              user_type: userType,
              name,
              last_name: lastName,
            },
          },
        });

        if (authError) throw authError;
        
        if (authData?.user) {
          // Crear perfil según el tipo de usuario
          if (userType === "fan") {
            const { error: fanError } = await supabase
              .from("fans")
              .insert({
                id: authData.user.id,
                name,
                last_name: lastName,
              });
            
            if (fanError) throw fanError;
          } else {
            const { error: artistError } = await supabase
              .from("artists")
              .insert({
                id: authData.user.id,
                name,
                last_name: lastName,
                facebook_url: facebookUrl,
                instagram_url: instagramUrl,
                description,
              });
            
            if (artistError) throw artistError;
          }
        }
        
        toast({
          title: "Registro exitoso",
          description: "Por favor, verifica tu correo electrónico para completar el registro.",
        });
      } else {
        // Inicio de sesión
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        navigate("/");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Ha ocurrido un error durante la autenticación.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <img 
            src="/lovable-uploads/e83b09aa-b9e7-4ee0-9f5f-8b22288e2a55.png" 
            alt="SeekArt Logo" 
            className="mx-auto h-24 w-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {isSignUp ? "Crear una cuenta" : "Iniciar sesión"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp
              ? "Regístrate para descubrir el arte cerca de ti"
              : "Accede a tu cuenta para explorar"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <Label htmlFor="userType">Tipo de cuenta</Label>
                  <RadioGroup
                    id="userType"
                    value={userType}
                    onValueChange={setUserType}
                    className="mt-2 flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fan" id="fan" />
                      <Label htmlFor="fan">Fan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="artist" id="artist" />
                      <Label htmlFor="artist">Artista</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="name">Nombre {userType === "artist" && "artístico o denominación"}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder={userType === "artist" ? "Nombre artístico" : "Nombre"}
                  />
                </div>

                {userType === "fan" && (
                  <div>
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Apellido"
                    />
                  </div>
                )}

                {userType === "artist" && (
                  <>
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Input
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Breve descripción de tu arte"
                      />
                    </div>

                    <div>
                      <Label htmlFor="instagramUrl">Instagram URL</Label>
                      <Input
                        id="instagramUrl"
                        type="url"
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        placeholder="https://instagram.com/tu_perfil"
                      />
                    </div>

                    <div>
                      <Label htmlFor="facebookUrl">Facebook URL</Label>
                      <Input
                        id="facebookUrl"
                        type="url"
                        value={facebookUrl}
                        onChange={(e) => setFacebookUrl(e.target.value)}
                        placeholder="https://facebook.com/tu_perfil"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] hover:from-[#8a76e4] hover:to-[#5d4894]"
              disabled={loading}
            >
              {loading
                ? "Procesando..."
                : isSignUp
                ? "Registrarse"
                : "Iniciar sesión"}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm font-medium text-[#9b87f5] hover:text-[#7E69AB]"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "¿Ya tienes una cuenta? Inicia sesión"
              : "¿No tienes una cuenta? Regístrate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
