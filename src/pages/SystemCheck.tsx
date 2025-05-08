
import SupabaseConnectionCheck from "@/components/SupabaseConnectionCheck";
import Navbar from "@/components/Navbar";

const SystemCheck = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Validaciones del Sistema</h1>
        
        {/* Logo image added between title and database status */}
        <div className="flex justify-center mb-10">
          <img 
            src="/lovable-uploads/e83b09aa-b9e7-4ee0-9f5f-8b22288e2a55.png" 
            alt="SeekArt Logo y QR" 
            className="h-60 w-auto object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <SupabaseConnectionCheck />
      </div>
    </div>
  );
};

export default SystemCheck;
