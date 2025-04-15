
import Navbar from "@/components/Navbar";
import DonationHeader from "@/components/donations/DonationHeader";
import PaymentMethods from "@/components/donations/PaymentMethods";
import SocialShare from "@/components/donations/SocialShare";
import ThankYouMessage from "@/components/donations/ThankYouMessage";

const Donations = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <DonationHeader />
        <PaymentMethods />
        <SocialShare />
        <ThankYouMessage />
      </div>
    </div>
  );
};

export default Donations;
