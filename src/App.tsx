
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import EventMap from "./pages/EventMap";
import Donations from "./pages/Donations";
import NotFound from "./pages/NotFound";
import FanProfile from "./pages/FanProfile";
import ArtistProfile from "./pages/ArtistProfile";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import Artists from "./pages/Artists";
import Events from "./pages/Events";

// Create query client outside the component to avoid recreations
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/map" element={<EventMap />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/fan-profile" element={<FanProfile />} />
            <Route path="/artist-profile" element={<ArtistProfile />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/edit-event/:eventId" element={<EditEvent />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/events" element={<Events />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
