
import Navbar from "@/components/Navbar";
import { EventMapView } from "@/components/map/EventMapView";

const EventMap = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Mapa de Eventos</h1>
          <p className="text-gray-600 mt-1">
            Explora eventos artísticos cerca de ti
          </p>
        </div>
        <EventMapView />
      </div>
    </div>
  );
};

export default EventMap;
