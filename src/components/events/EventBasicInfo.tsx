
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EventBasicInfoProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
}

export const EventBasicInfo = ({
  title,
  setTitle,
  description,
  setDescription,
  date,
  setDate,
}: EventBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Título del evento *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>
      
      <div>
        <Label htmlFor="date">Fecha y hora *</Label>
        <Input
          id="date"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
    </div>
  );
};
