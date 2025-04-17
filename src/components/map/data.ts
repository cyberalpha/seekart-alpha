
import { 
  Music, 
  Theater, 
  Image as ImageIcon, 
  BookText, 
  Film, 
  Sparkles
} from "lucide-react";
import { ArtType } from "./types";

// Definimos los tipos de arte con sus respectivos colores e iconos
export const artTypes: ArtType[] = [
  { id: 'music', name: 'Música', color: 'seekart-green', icon: Music },
  { id: 'theater', name: 'Teatro', color: 'seekart-yellow', icon: Theater },
  { id: 'visual', name: 'Imágenes y formas', color: 'seekart-red', icon: ImageIcon },
  { id: 'literature', name: 'Letras', color: 'seekart-blue', icon: BookText },
  { id: 'cinema', name: 'Cine', color: 'seekart-orange', icon: Film },
  { id: 'other', name: 'Otros', color: 'seekart-purple', icon: Sparkles },
];
