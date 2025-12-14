import { supabase } from "@/integrations/supabase/client";

export type VerifiedUserType = 'artist' | 'fan' | null;

/**
 * Verifies user type by checking if the user exists in the artists or fans table.
 * This provides server-side verification instead of relying on JWT metadata.
 */
export const getVerifiedUserType = async (userId: string): Promise<VerifiedUserType> => {
  // Check if user is an artist
  const { data: artist, error: artistError } = await supabase
    .from('artists')
    .select('id')
    .eq('id', userId)
    .maybeSingle();
  
  if (!artistError && artist) {
    return 'artist';
  }
  
  // Check if user is a fan
  const { data: fan, error: fanError } = await supabase
    .from('fans')
    .select('id')
    .eq('id', userId)
    .maybeSingle();
  
  if (!fanError && fan) {
    return 'fan';
  }
  
  return null;
};
