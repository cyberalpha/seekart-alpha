
import Navbar from "@/components/Navbar";
import { EventMapView } from "@/components/map/EventMapView";

const EventMap = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      <div className="flex-1 relative">
        <EventMapView />
      </div>
    </div>
  );
};

export default EventMap;
