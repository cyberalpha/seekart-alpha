
import { useState, useEffect } from "react";
import { supabase, Artist } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useArtists = (userId: string | null, userType: string | null) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  return {
    artists,
    followedArtists,
    loading,
    handleFollow,
    handleUnfollow
  };
};
