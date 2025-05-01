
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Artist } from "@/integrations/supabase/client";
import { UserRound, Heart, HeartOff, Facebook, Instagram } from "lucide-react";

// Mapeo de tipos de arte a colores de SeekArt con soporte para variaciones
const artTypeColors: { [key: string]: string } = {
  // Música (con variaciones)
  "Música": "bg-seekart-green hover:bg-seekart-green/90",
  "Musica": "bg-seekart-green hover:bg-seekart-green/90",
  "música": "bg-seekart-green hover:bg-seekart-green/90",
  "musica": "bg-seekart-green hover:bg-seekart-green/90",
  
  // Teatro (con variaciones)
  "Teatro": "bg-seekart-yellow hover:bg-seekart-yellow/90",
  "teatro": "bg-seekart-yellow hover:bg-seekart-yellow/90",
  
  // Visual (con variaciones)
  "Visual": "bg-seekart-red hover:bg-seekart-red/90",
  "visual": "bg-seekart-red hover:bg-seekart-red/90",
  
  // Literatura/Letras (con variaciones)
  "Literatura": "bg-seekart-blue hover:bg-seekart-blue/90",
  "literatura": "bg-seekart-blue hover:bg-seekart-blue/90",
  "Letras": "bg-seekart-blue hover:bg-seekart-blue/90",
  "letras": "bg-seekart-blue hover:bg-seekart-blue/90",
  
  // Cine (con variaciones)
  "Cine": "bg-seekart-orange hover:bg-seekart-orange/90",
  "cine": "bg-seekart-orange hover:bg-seekart-orange/90",
  
  // Otros (con variaciones)
  "Otros": "bg-seekart-purple hover:bg-seekart-purple/90",
  "otros": "bg-seekart-purple hover:bg-seekart-purple/90"
};

interface ArtistCardProps {
  artist: Artist;
  userType: string | null;
  onFollow: (artistId: string) => Promise<void>;
  onUnfollow: (artistId: string) => Promise<void>;
}

export const ArtistCard = ({ artist, userType, onFollow, onUnfollow }: ArtistCardProps) => {
  // Función mejorada para obtener el color del badge, con normalización
  const getBadgeColor = (artType: string) => {
    // Buscar el color directamente o con la versión en minúscula
    return artTypeColors[artType] || artTypeColors[artType.toLowerCase()] || "bg-seekart-purple hover:bg-seekart-purple/90";
  };

  return (
    <Card key={artist.id} className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              {artist.profile_image ? (
                <AvatarImage src={artist.profile_image} alt={artist.name} />
              ) : (
                <AvatarFallback className="bg-[#9b87f5] text-white">
                  <UserRound size={32} />
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">{artist.name}</h3>
              <p className="text-gray-600 mb-4">
                {artist.description || "Sin descripción"}
              </p>
            </div>
          </div>

          {artist.art_types && artist.art_types.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {artist.art_types.map((type, index) => (
                <Badge 
                  key={index} 
                  className={`${getBadgeColor(type)} text-white`}
                >
                  {type}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            {artist.instagram_url && (
              <a 
                href={artist.instagram_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#E1306C] hover:underline"
              >
                <Instagram size={20} />
                <span>Instagram</span>
              </a>
            )}
            
            {artist.facebook_url && (
              <a 
                href={artist.facebook_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#1877F2] hover:underline"
              >
                <Facebook size={20} />
                <span>Facebook</span>
              </a>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {artist.follower_count || 0} seguidores
            </div>
            
            {userType === "fan" && (
              artist.isFollowing ? (
                <Button 
                  variant="outline" 
                  onClick={() => onUnfollow(artist.id)}
                  className="flex items-center gap-2"
                >
                  <HeartOff size={16} />
                  Dejar de seguir
                </Button>
              ) : (
                <Button 
                  onClick={() => onFollow(artist.id)}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#9b87f5] to-[#6E59A5]"
                >
                  <Heart size={16} />
                  Seguir
                </Button>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
