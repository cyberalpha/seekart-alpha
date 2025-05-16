
import SupabaseConnectionCheck from "@/components/SupabaseConnectionCheck";
import Navbar from "@/components/Navbar";
import StorageBucketInitializer from "@/components/StorageBucketInitializer";

const SystemCheck = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Validaciones del Sistema</h1>
        
        {/* Logo image added between title and database status */}
        <div className="flex justify-center mb-10">
          <img 
            src="/lovable-uploads/b06d1bd3-7313-4745-a478-2ed9dd18cbd4.png" 
            alt="SeekArt Logo y Mascota" 
            className="h-auto max-w-full md:max-w-lg object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <SupabaseConnectionCheck />
        <StorageBucketInitializer />
      </div>
    </div>
  );
};

export default SystemCheck;
