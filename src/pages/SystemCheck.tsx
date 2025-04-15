
import SupabaseConnectionCheck from "@/components/SupabaseConnectionCheck";
import Navbar from "@/components/Navbar";

const SystemCheck = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Validaciones del Sistema</h1>
        <SupabaseConnectionCheck />
      </div>
    </div>
  );
};

export default SystemCheck;
