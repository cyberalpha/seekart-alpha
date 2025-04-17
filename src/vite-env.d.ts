
/// <reference types="vite/client" />
/// <reference types="@types/geojson" />

// Define los colores de SeekArt como variables CSS
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_MAPBOX_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
