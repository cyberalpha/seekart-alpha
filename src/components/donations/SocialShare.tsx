
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const SocialShare = () => {
  return (
    <div className="mt-8 text-center">
      <h2 className="text-xl font-semibold mb-4">Comparte esta iniciativa</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Ayúdanos a llegar a más personas compartiendo esta página en tus redes sociales:
      </p>
      <div className="flex justify-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <a href="#" aria-label="Compartir en Facebook">
            <Facebook className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a href="#" aria-label="Compartir en Twitter">
            <Twitter className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a href="#" aria-label="Compartir en Instagram">
            <Instagram className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a href="#" aria-label="Compartir en LinkedIn">
            <Linkedin className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default SocialShare;
