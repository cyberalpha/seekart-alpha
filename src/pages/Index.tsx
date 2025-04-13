
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Descubre arte cerca de ti</span>
                  <span className="block bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                    con SeekArt
                  </span>
                </h1>
                <p className="mt-6 max-w-2xl text-xl text-gray-500">
                  Conecta con artistas locales, descubre eventos culturales y 
                  sumérgete en la escena artística que te rodea.
                </p>
              </div>
              
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                {session ? (
                  <Link to="/map">
                    <Button className="bg-gradient-to-r from-green-500 to-teal-500 font-medium hover:from-green-600 hover:to-teal-600">
                      Explorar mapa cultural
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button className="bg-gradient-to-r from-green-500 to-teal-500 font-medium hover:from-green-600 hover:to-teal-600">
                      Comenzar ahora
                    </Button>
                  </Link>
                )}
                <Link to="/about">
                  <Button variant="outline">
                    Conoce más
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <img 
                src="/lovable-uploads/e83b09aa-b9e7-4ee0-9f5f-8b22288e2a55.png" 
                alt="SeekArt Ilustración" 
                className="h-auto w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Descubre el arte que te rodea
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              SeekArt te conecta con el ecosistema cultural local
            </p>
          </div>
          
          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Encuentra artistas locales</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Descubre artistas y creadores en tu vecindario a través de nuestro mapa interactivo.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Eventos culturales</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Mantente al día con exposiciones, conciertos y eventos culturales en tu ciudad.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Comunidad artística</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Forma parte de la comunidad, interactúa con artistas y conoce a otros amantes del arte.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-teal-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              ¿Eres artista?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-white opacity-90">
              Registra tu perfil y conecta con nuevas audiencias en tu localidad
            </p>
            <div className="mt-8">
              <Link to="/auth">
                <Button className="bg-white font-medium text-green-600 hover:bg-gray-100">
                  Crear perfil de artista
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Explorar</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/artists" className="text-base text-gray-300 hover:text-white">Artistas</Link></li>
                <li><Link to="/events" className="text-base text-gray-300 hover:text-white">Eventos</Link></li>
                <li><Link to="/map" className="text-base text-gray-300 hover:text-white">Mapa cultural</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Recursos</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/faq" className="text-base text-gray-300 hover:text-white">Preguntas frecuentes</Link></li>
                <li><Link to="/support" className="text-base text-gray-300 hover:text-white">Soporte</Link></li>
                <li><Link to="/blog" className="text-base text-gray-300 hover:text-white">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Empresa</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/about" className="text-base text-gray-300 hover:text-white">Acerca de</Link></li>
                <li><Link to="/contact" className="text-base text-gray-300 hover:text-white">Contacto</Link></li>
                <li><Link to="/donations" className="text-base text-gray-300 hover:text-white">Donaciones</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/privacy" className="text-base text-gray-300 hover:text-white">Privacidad</Link></li>
                <li><Link to="/terms" className="text-base text-gray-300 hover:text-white">Términos</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-center text-base text-gray-400">
              &copy; 2025 SeekArt. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
