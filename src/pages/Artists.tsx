
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { ArtistCard } from "@/components/artists/ArtistCard";
import { useArtists } from "@/hooks/useArtists";

const Artists = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

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

  const { 
    artists, 
    followedArtists, 
    loading, 
    handleFollow, 
    handleUnfollow 
  } = useArtists(userId, userType);

  const filteredArtists = searchQuery 
    ? artists.filter(artist => 
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (artist.description && artist.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : artists;

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
                  {filteredArtists.map(artist => (
                    <ArtistCard
                      key={artist.id}
                      artist={artist}
                      userType={userType}
                      onFollow={handleFollow}
                      onUnfollow={handleUnfollow}
                    />
                  ))}
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
                  {followedArtists.map(artist => (
                    <ArtistCard
                      key={artist.id}
                      artist={artist}
                      userType={userType}
                      onFollow={handleFollow}
                      onUnfollow={handleUnfollow}
                    />
                  ))}
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
                {filteredArtists.map(artist => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    userType={userType}
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Artists;
