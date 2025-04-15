import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ArtistProfile from "./pages/ArtistProfile";
import FanProfile from "./pages/FanProfile";
import EventMap from "./pages/EventMap";
import Events from "./pages/Events";
import Artists from "./pages/Artists";
import Donations from "./pages/Donations";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import NotFound from "./pages/NotFound";
import SystemCheck from "./pages/SystemCheck";
import StorageBucketInitializer from "./components/StorageBucketInitializer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Router>
        <StorageBucketInitializer />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/artist-profile" element={<ArtistProfile />} />
          <Route path="/fan-profile" element={<FanProfile />} />
          <Route path="/map" element={<EventMap />} />
          <Route path="/events" element={<Events />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/system-check" element={<SystemCheck />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/edit-event/:eventId" element={<EditEvent />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
