import Navbar from "@/components/Navbar";
import { EventMapView } from "@/components/map/EventMapView";
import MetaTags from "@/components/shared/MetaTags";

const EventMap = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      <MetaTags
        title="Mapa de Eventos Culturales - SeekArt"
        description="Explora eventos artísticos y culturales en un mapa interactivo. Encuentra conciertos, exposiciones y performances cerca de ti."
      />
      <Navbar />
      <main className="flex-1 relative">
        <h1 className="sr-only">Mapa de eventos culturales cerca de ti</h1>
        <EventMapView />
      </main>
    </div>
  );
};

export default EventMap;
