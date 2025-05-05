import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ArtistProfile from "./pages/ArtistProfile";
import FanProfile from "./pages/FanProfile";
import EventMap from "./pages/EventMap";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-seekart-purple"></div>
      </div>;
    }
    
    if (!session) {
      return <Navigate to="/auth" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light">
        <Router>
          <StorageBucketInitializer />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/artist-profile" element={
              <ProtectedRoute>
                <ArtistProfile />
              </ProtectedRoute>
            } />
            <Route path="/fan-profile" element={
              <ProtectedRoute>
                <FanProfile />
              </ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute>
                <EventMap />
              </ProtectedRoute>
            } />
            <Route path="/events" element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } />
            <Route path="/events/:eventId" element={
              <ProtectedRoute>
                <EventDetail />
              </ProtectedRoute>
            } />
            <Route path="/artists" element={
              <ProtectedRoute>
                <Artists />
              </ProtectedRoute>
            } />
            <Route path="/donations" element={<Donations />} />
            <Route path="/system-check" element={<SystemCheck />} />
            <Route path="/create-event" element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            } />
            <Route path="/edit-event/:eventId" element={
              <ProtectedRoute>
                <EditEvent />
              </ProtectedRoute>
            } />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
