
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-purple-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <img
                src="/lovable-uploads/e83b09aa-b9e7-4ee0-9f5f-8b22288e2a55.png"
                alt="SeekArt Logo"
                className="h-24 w-auto mb-4"
              />
            </div>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Descubre y conecta con artistas locales. Encuentra eventos únicos cerca de ti.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/auth"
                className="rounded-md bg-[#9b87f5] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#8a76e4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b87f5]"
              >
                Comenzar ahora
              </a>
              <a href="/events" className="text-sm font-semibold leading-6 text-gray-900">
                Ver eventos <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900">Descubre Arte Local</h3>
              <p className="mt-2 text-gray-600">
                Encuentra artistas y eventos cerca de ti. Conecta con la comunidad artística local.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900">Eventos Únicos</h3>
              <p className="mt-2 text-gray-600">
                Asiste a exposiciones, conciertos y performances de artistas emergentes y establecidos.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900">Apoya el Arte</h3>
              <p className="mt-2 text-gray-600">
                Contribuye al crecimiento de la comunidad artística a través de donaciones y asistencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
