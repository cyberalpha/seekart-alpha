
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EventLinksProps {
  ticketUrl: string;
  setTicketUrl: (value: string) => void;
  videoUrl: string;
  setVideoUrl: (value: string) => void;
}

export const EventLinks = ({
  ticketUrl,
  setTicketUrl,
  videoUrl,
  setVideoUrl,
}: EventLinksProps) => {
  return (
    <div className="space-y-4">
      <Label>Enlaces opcionales</Label>
      
      <div>
        <Label htmlFor="ticketUrl">Enlace para comprar boletos</Label>
        <Input
          id="ticketUrl"
          type="url"
          value={ticketUrl}
          onChange={(e) => setTicketUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>
      
      <div>
        <Label htmlFor="videoUrl">Enlace de video</Label>
        <Input
          id="videoUrl"
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/..."
        />
      </div>
    </div>
  );
};
