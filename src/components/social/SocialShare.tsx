
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Facebook, Instagram, Twitter, Link, Share2 } from "lucide-react";

interface SocialShareProps {
  url: string;
  title: string;
}

export const SocialShare = ({ url, title }: SocialShareProps) => {
  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    const shareUrls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
    };
    
    if (platform === 'instagram') {
      // Para Instagram, copiamos el enlace y mostramos instrucciones
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Enlace copiado",
          description: "Pega este enlace en tu historia de Instagram o en tu biografía.",
        });
      });
      return;
    }
    
    if (platform in shareUrls) {
      window.open(shareUrls[platform], '_blank');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "¡Enlace copiado!",
        description: "El enlace se ha copiado al portapapeles.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo copiar el enlace.",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="icon"
        className="bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
        onClick={() => handleShare('facebook')}
        title="Compartir en Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="bg-gradient-to-br from-[#E4405F] to-[#FFDC80] text-white hover:opacity-90"
        onClick={() => handleShare('instagram')}
        title="Compartir en Instagram"
      >
        <Instagram className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90"
        onClick={() => handleShare('twitter')}
        title="Compartir en Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="bg-[#25D366] text-white hover:bg-[#25D366]/90"
        onClick={() => handleShare('whatsapp')}
        title="Compartir en WhatsApp"
      >
        <Share2 className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={copyLink}
        className="bg-gray-500 text-white hover:bg-gray-600"
        title="Copiar enlace"
      >
        <Link className="h-4 w-4" />
      </Button>
    </div>
  );
};
