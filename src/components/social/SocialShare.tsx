
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Facebook, Instagram, Twitter, Link } from "lucide-react";

interface SocialShareProps {
  url: string;
  title: string;
}

export const SocialShare = ({ url, title }: SocialShareProps) => {
  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      instagram: `https://www.instagram.com/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
    };
    
    if (platform in shareUrls) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
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
      >
        <Facebook className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="bg-gradient-to-br from-[#E4405F] to-[#FFDC80] text-white hover:opacity-90"
        onClick={() => handleShare('instagram')}
      >
        <Instagram className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90"
        onClick={() => handleShare('twitter')}
      >
        <Twitter className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={copyLink}
        className="bg-gray-500 text-white hover:bg-gray-600"
      >
        <Link className="h-4 w-4" />
      </Button>
    </div>
  );
};
