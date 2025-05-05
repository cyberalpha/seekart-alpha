
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  type?: string;
}

const MetaTags = ({ 
  title = "SeekArt - En busca del Arte",
  description = "Encuentra artistas y eventos culturales cerca de ti con SeekArt", 
  imageUrl = "/lovable-uploads/e83b09aa-b9e7-4ee0-9f5f-8b22288e2a55.png",
  url,
  type = "website"
}: MetaTagsProps) => {
  // Ensure image URL is absolute
  const absoluteImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${window.location.origin}${imageUrl}`;
  
  // Use current URL if not provided
  const pageUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph Meta Tags (Facebook, LinkedIn, etc) */}
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
    </Helmet>
  );
};

export default MetaTags;
