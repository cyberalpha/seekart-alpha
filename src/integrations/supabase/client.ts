
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ahizopkcxrewnhvgyoue.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoaXpvcGtjeHJld25odmd5b3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NTM3MjYsImV4cCI6MjA2MDEyOTcyNn0.jT6F-ouZzc_XcSxyub-zxw_tsQmD1tQ015C4EJ8AJP4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

// Define helper types for strongly-typed queries
export type Tables = Database['public']['Tables'];
export type Artist = Tables['artists']['Row'] & { 
  follower_count?: number | null;
  isFollowing?: boolean; 
};
export type Fan = Tables['fans']['Row'];
export type Event = Tables['events']['Row'];
export type Follow = Tables['follows']['Row'];
