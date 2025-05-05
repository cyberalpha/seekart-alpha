
import Navbar from "@/components/Navbar";
import DonationHeader from "@/components/donations/DonationHeader";
import PaymentMethods from "@/components/donations/PaymentMethods";
import { SocialShare } from "@/components/social/SocialShare";
import ThankYouMessage from "@/components/donations/ThankYouMessage";
import MetaTags from "@/components/shared/MetaTags";

const Donations = () => {
  // URL y título para compartir
  const shareUrl = window.location.href;
  const shareTitle = "Apoya a SeekArt con tu donación";
  const shareImage = "/lovable-uploads/e83b09aa-b9e7-4ee0-9f5f-8b22288e2a55.png";
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <MetaTags 
        title="Donaciones - SeekArt"
        description="Apoya a SeekArt con tu donación para seguir conectando artistas con su público"
        imageUrl={shareImage}
      />
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <DonationHeader />
        <PaymentMethods />
        <div className="mt-8">
          <div className="flex justify-center">
            <SocialShare url={shareUrl} title={shareTitle} />
          </div>
        </div>
        <ThankYouMessage />
      </div>
    </div>
  );
};

export default Donations;
