
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EventImageUploaderProps {
  imageUrl: string;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploading: boolean;
}

export const EventImageUploader = ({
  imageUrl,
  onImageUpload,
  uploading
}: EventImageUploaderProps) => {
  return (
    <div>
      <Label>Imagen del evento *</Label>
      <div className="mt-2 flex flex-col items-center space-y-4">
        {imageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-md">
            <img
              src={imageUrl}
              alt="Vista previa"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        
        <div>
          <Input
            id="eventImage"
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            disabled={uploading}
            className="hidden"
          />
          <Label
            htmlFor="eventImage"
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#3498db] px-4 py-2 text-sm font-medium text-white hover:bg-[#2980b9]"
          >
            <Upload size={16} />
            {uploading ? "Subiendo..." : imageUrl ? "Cambiar imagen" : "Subir imagen"}
          </Label>
        </div>
      </div>
    </div>
  );
};
