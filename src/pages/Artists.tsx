import { useState, useEffect } from "react";
import { supabase, Artist } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRound, Search, Heart, HeartOff, Facebook, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Artists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
        const userMetadata = session.user.user_metadata;
        setUserType(userMetadata?.user_type || null);
      }
    };

    fetchUserSession();
  }, []);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        
        const { data: artistsData, error: artistsError } = await supabase
          .from("artists")
          .select("*")
          .order("name");
        
        if (artistsError) throw artistsError;
        
        let followedIds: string[] = [];
        
        if (userId && userType === "fan") {
          const { data: followsData, error: followsError } = await supabase
            .from("follows")
            .select("artist_id")
            .eq("fan_id", userId);
          
          if (followsError) throw followsError;
          
          followedIds = followsData?.map(follow => follow.artist_id) || [];
        }
        
        const artistsWithFollowStatus = artistsData?.map(artist => {
          return {
            ...artist,
            follower_count: 0,
            isFollowing: followedIds.includes(artist.id)
          };
        }) || [];
        
        setArtists(artistsWithFollowStatus);
        setFollowedArtists(artistsWithFollowStatus.filter(artist => artist.isFollowing));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching artists:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los artistas. Inténtalo de nuevo más tarde.",
        });
        setLoading(false);
      }
    };

    fetchArtists();
  }, [userId, userType, toast]);

  const handleFollow = async (artistId: string) => {
    try {
      if (!userId) {
        toast({
          variant: "destructive",
          title: "Inicio de sesión requerido",
          description: "Debes iniciar sesión como fan para seguir a un artista.",
        });
        return;
      }
      
      if (userType !== "fan") {
        toast({
          description: "Solo los fans pueden seguir a artistas.",
        });
        return;
      }
      
      const { error } = await supabase
        .from("follows")
        .insert({
          fan_id: userId,
          artist_id: artistId
        });
      
      if (error) throw error;
      
      const updatedArtists = artists.map(artist => 
        artist.id === artistId 
          ? { 
              ...artist, 
              isFollowing: true, 
              follower_count: (artist.follower_count || 0) + 1 
            } 
          : artist
      );
      
      setArtists(updatedArtists);
      setFollowedArtists(updatedArtists.filter(artist => artist.isFollowing));
      
      toast({
        title: "Artista seguido",
        description: "Ahora estás siguiendo a este artista.",
      });
    } catch (error) {
      console.error("Error following artist:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo seguir al artista. Inténtalo de nuevo más tarde.",
      });
    }
  };

  const handleUnfollow = async (artistId: string) => {
    try {
      if (!userId) return;
      
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("fan_id", userId)
        .eq("artist_id", artistId);
      
      if (error) throw error;
      
      const updatedArtists = artists.map(artist => 
        artist.id === artistId 
          ? { 
              ...artist, 
              isFollowing: false, 
              follower_count: Math.max((artist.follower_count || 0) - 1, 0) 
            } 
          : artist
      );
      
      setArtists(updatedArtists);
      setFollowedArtists(updatedArtists.filter(artist => artist.isFollowing));
      
      toast({
        title: "Dejaste de seguir",
        description: "Ya no sigues a este artista.",
      });
    } catch (error) {
      console.error("Error unfollowing artist:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo dejar de seguir al artista. Inténtalo de nuevo más tarde.",
      });
    }
  };

  const filteredArtists = searchQuery 
    ? artists.filter(artist => 
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (artist.description && artist.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : artists;

  const renderArtistCard = (artist: Artist) => (
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
                <Badge key={index} className="bg-[#9b87f5]">
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
                  onClick={() => handleUnfollow(artist.id)}
                  className="flex items-center gap-2"
                >
                  <HeartOff size={16} />
                  Dejar de seguir
                </Button>
              ) : (
                <Button 
                  onClick={() => handleFollow(artist.id)}
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Explorar Artistas</h1>
        
        <div className="mb-6 flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar artistas por nombre o descripción"
              className="pl-10"
            />
          </div>
        </div>
        
        {userType === "fan" && (
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Todos los artistas</TabsTrigger>
              <TabsTrigger value="following">Artistas que sigo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {loading ? (
                <p className="text-center">Cargando artistas...</p>
              ) : filteredArtists.length === 0 ? (
                <p className="text-center text-gray-500">
                  {searchQuery ? "No se encontraron artistas que coincidan con tu búsqueda." : "No hay artistas disponibles."}
                </p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredArtists.map(renderArtistCard)}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="following">
              {loading ? (
                <p className="text-center">Cargando artistas...</p>
              ) : followedArtists.length === 0 ? (
                <p className="text-center text-gray-500">
                  No sigues a ningún artista aún.
                </p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {followedArtists.map(renderArtistCard)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
        
        {userType !== "fan" && (
          <>
            {loading ? (
              <p className="text-center">Cargando artistas...</p>
            ) : filteredArtists.length === 0 ? (
              <p className="text-center text-gray-500">
                {searchQuery ? "No se encontraron artistas que coincidan con tu búsqueda." : "No hay artistas disponibles."}
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredArtists.map(renderArtistCard)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Artists;
