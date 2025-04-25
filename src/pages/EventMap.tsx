
import Navbar from "@/components/Navbar";
import { EventMapView } from "@/components/map/EventMapView";

const EventMap = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      <div className="mx-auto px-4 py-6 sm:px-6 lg:container">
        <EventMapView />
      </div>
    </div>
  );
};

export default EventMap;
