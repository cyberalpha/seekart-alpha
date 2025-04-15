
import Navbar from "@/components/Navbar";
import { EventMapView } from "@/components/map/EventMapView";
import { useToast } from "@/components/ui/use-toast";

const EventMap = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Mapa de Eventos</h1>
        </div>
        <EventMapView />
      </div>
    </div>
  );
};

export default EventMap;
