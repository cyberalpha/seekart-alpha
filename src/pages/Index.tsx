
import Navbar from "@/components/Navbar";
import SupabaseConnectionCheck from "@/components/SupabaseConnectionCheck";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            SeekArt
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            En busca del arte
          </p>
          <p className="mt-2 text-md text-gray-500">
            Encuentra eventos artísticos cercanos a ti
          </p>
          
          <div className="mt-10">
            <SupabaseConnectionCheck />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
