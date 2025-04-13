
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Facebook, Twitter, Instagram, Link } from "lucide-react";
import { FaPaypal } from "react-icons/fa";

const DonationCard = ({ amount, description, onClick }: { amount: string; description: string; onClick: () => void }) => (
  <Card className="cursor-pointer transition-all hover:shadow-md" onClick={onClick}>
    <CardHeader className="pb-3">
      <CardTitle className="text-2xl font-bold text-center">${amount}</CardTitle>
    </CardHeader>
    <CardContent className="text-center pb-6">
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Donations = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDonationClick = (donationAmount: string) => {
    setAmount(donationAmount);
    setSelectedAmount(donationAmount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulación de procesamiento de donación
    setTimeout(() => {
      toast({
        title: "¡Gracias por tu apoyo!",
        description: `Has donado $${amount} a nuestra comunidad artística.`,
      });
      
      // Reset form
      setName("");
      setEmail("");
      setAmount("");
      setMessage("");
      setSelectedAmount(null);
    }, 1000);
  };

  const predefinedDonations = [
    { amount: "5", description: "Café para un artista" },
    { amount: "20", description: "Materiales para un taller" },
    { amount: "50", description: "Soporte para un proyecto pequeño" },
    { amount: "100", description: "Patrocinio de un evento" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] bg-clip-text text-transparent">
            Apoya el arte local
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-700">
            Tu donación ayuda a mantener viva la comunidad artística y apoya a artistas locales en su desarrollo creativo.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle>Haz tu donación</CardTitle>
                <CardDescription>
                  Todas las donaciones son utilizadas para apoyar a artistas locales.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        placeholder="Tu nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Selecciona un monto</Label>
                    <div className="grid gap-4 sm:grid-cols-4">
                      {predefinedDonations.map((donation) => (
                        <DonationCard
                          key={donation.amount}
                          amount={donation.amount}
                          description={donation.description}
                          onClick={() => handleDonationClick(donation.amount)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customAmount">O ingresa otro monto</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <Input
                        id="customAmount"
                        type="number"
                        min="1"
                        step="1"
                        className="pl-7"
                        placeholder="Ingresa un monto"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setSelectedAmount(null);
                        }}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje (opcional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Deja un mensaje para los artistas"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                    />
                  </div>
                </form>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t p-6">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <FaPaypal className="h-4 w-4" />
                    <span>PayPal</span>
                  </Button>
                </div>
                
                <Button 
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] hover:from-[#8a76e4] hover:to-[#5d4894]"
                >
                  Donar ${amount || "0"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle>Beneficios de donar</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Apoyas el talento local</h3>
                  <p className="text-sm text-muted-foreground">
                    Tus donaciones permiten a los artistas locales continuar creando y compartiendo su arte con la comunidad.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Fortaleces la comunidad</h3>
                  <p className="text-sm text-muted-foreground">
                    Contribuyes a la creación de eventos culturales que enriquecen nuestra comunidad y crean espacios de encuentro.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Recibes reconocimiento</h3>
                  <p className="text-sm text-muted-foreground">
                    Los donantes son reconocidos en nuestros eventos y plataformas digitales como patrocinadores del arte.
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="border-t p-6">
                <div className="w-full space-y-4">
                  <p className="text-sm font-medium">Comparte esta iniciativa:</p>
                  <div className="flex space-x-4">
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
                      <a href="#" aria-label="Compartir enlace">
                        <Link className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donations;
