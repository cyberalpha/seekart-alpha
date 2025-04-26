
import Navbar from "@/components/Navbar";
import { EventForm } from "@/components/events/EventForm";
import { useNavigate } from "react-router-dom";
import { useEventSubmit } from "@/hooks/useEventSubmit";
import { useImageUpload } from "@/hooks/useImageUpload";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { handleSubmit, loading } = useEventSubmit();
  const { uploading } = useImageUpload();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Crear Nuevo Evento</h1>
        
        <EventForm
          onSubmit={handleSubmit}
          submitButtonText="Crear evento"
          onCancel={() => navigate("/artist-profile")}
          loading={loading}
          uploading={uploading}
        />
      </div>
    </div>
  );
};

export default CreateEvent;
