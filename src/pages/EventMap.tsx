import Navbar from "@/components/Navbar";
import { EventMapView } from "@/components/map/EventMapView";
const EventMap = () => {
  return <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4">
          
          
        </div>
        <EventMapView />
      </div>
    </div>;
};
export default EventMap;