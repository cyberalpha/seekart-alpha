
import { FeatureCollection, Geometry } from 'geojson';
import mapboxgl from 'mapbox-gl';
import { ReactNode } from 'react';

// Art type definitions
export type ArtTypeId = 'music' | 'theater' | 'visual' | 'literature' | 'cinema' | 'other';

export interface ArtType {
  id: ArtTypeId;
  name: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Mapping from frontend to database art types
export const artTypeMapping: Record<ArtTypeId, string> = {
  'music': 'musica',
  'theater': 'teatro',
  'visual': 'imagenes',
  'literature': 'letras',
  'cinema': 'cine',
  'other': 'otro'
};

// Color mappings for markers
export const markerColors: Record<ArtTypeId, string> = {
  'music': '#2CDD68', // Verde brillante (SeekArt)
  'theater': '#FEDD61', // Amarillo brillante (SeekArt)
  'visual': '#FE5D5D', // Rojo brillante (SeekArt)
  'literature': '#4192FE', // Azul brillante (SeekArt)
  'cinema': '#FF8A2C', // Naranja brillante (SeekArt)
  'other': '#AF59FF', // Púrpura brillante (SeekArt)
};

export interface MapEvent {
  id: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  art_types: string[];
  [key: string]: any;
}

export interface EventMarker {
  event: MapEvent;
  marker: mapboxgl.Marker;
}

export interface GeoJSONCircle extends GeoJSON.Feature<GeoJSON.Polygon> {
  properties: Record<string, any>;
}
