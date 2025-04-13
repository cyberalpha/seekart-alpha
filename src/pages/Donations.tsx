import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Check, CreditCard } from "lucide-react";
import { FaCcPaypal } from "react-icons/fa";
const Donations = () => {
  const [amount, setAmount] = useState("25");
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [isMonthly, setIsMonthly] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const {
    toast
  } = useToast();
  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
      toast({
        title: "¡Gracias por tu donación!",
        description: "Tu apoyo es fundamental para la comunidad artística."
      });
    }, 1500);
  };
  const resetForm = () => {
    setIsComplete(false);
    setAmount("25");
    setCustomAmount("");
    setCardNumber("");
    setCardName("");
    setCardExpiry("");
    setCardCvc("");
  };
  if (isComplete) {
    return <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navbar />
        
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="rounded-full bg-green-100 p-3 text-green-600 mx-auto inline-flex">
            <Check size={24} />
          </div>
          
          <h1 className="mt-6 text-3xl font-bold">¡Donación exitosa!</h1>
          
          <p className="mt-4 text-lg text-gray-600">
            Gracias por tu generosa donación de ${customAmount || amount} {isMonthly && "mensuales"}.
            Tu apoyo ayuda a fortalecer la comunidad artística local.
          </p>
          
          <div className="mt-8">
            <Button onClick={resetForm} className="bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] hover:from-[#8a76e4] hover:to-[#5d4894]">
              Hacer otra donación
            </Button>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Apoya el arte local
            </h1>
            
            <p className="mt-4 text-lg text-gray-600">
              Tu donación ayuda a mantener viva la comunidad artística y apoya a artistas locales en su desarrollo creativo.
            </p>
            
            
            
            
          </div>
          
          <div>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 p-6">
                <Tabs value={isMonthly ? "monthly" : "once"} onValueChange={v => setIsMonthly(v === "monthly")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="once">Donación única</TabsTrigger>
                    <TabsTrigger value="monthly">Donación mensual</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <form onSubmit={handleDonation} className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label className="mb-2 block text-base font-medium">
                      Elige un monto {isMonthly && "mensual"}
                    </Label>
                    
                    <RadioGroup value={amount} onValueChange={setAmount} className="grid grid-cols-3 gap-3">
                      {["25", "50", "100", "250", "500", "1000"].map(value => <div key={value}>
                          <RadioGroupItem value={value} id={`amount-${value}`} className="peer sr-only" />
                          <Label htmlFor={`amount-${value}`} className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#9b87f5]">
                            <span className="text-xl font-bold">${value}</span>
                            <span className="text-xs text-muted-foreground">MXN</span>
                          </Label>
                        </div>)}
                    </RadioGroup>
                    
                    <div className="mt-4">
                      <Label htmlFor="customAmount" className="mb-2 block text-sm font-medium">
                        O ingresa un monto personalizado
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input id="customAmount" type="number" value={customAmount} onChange={e => {
                        setCustomAmount(e.target.value);
                        if (e.target.value) setAmount("");
                      }} placeholder="Otro monto" className="pl-8" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="block text-base font-medium">
                      Método de pago
                    </Label>
                    
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                      <div className="flex items-center space-x-3 rounded-md border border-gray-200 p-3">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex flex-1 items-center space-x-3">
                          <CreditCard className="h-5 w-5 text-gray-600" />
                          <span>Tarjeta de crédito / débito</span>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-3 rounded-md border border-gray-200 p-3">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex flex-1 items-center space-x-3">
                          <FaCcPaypal className="h-5 w-5 text-gray-600" />
                          <span>PayPal</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {paymentMethod === "card" && <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Número de tarjeta</Label>
                        <Input id="cardNumber" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" required />
                      </div>
                      
                      <div>
                        <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                        <Input id="cardName" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="John Doe" required />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry">Fecha de expiración</Label>
                          <Input id="cardExpiry" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} placeholder="MM/AA" required />
                        </div>
                        
                        <div>
                          <Label htmlFor="cardCvc">CVC</Label>
                          <Input id="cardCvc" value={cardCvc} onChange={e => setCardCvc(e.target.value)} placeholder="123" required />
                        </div>
                      </div>
                    </div>}
                  
                  {isMonthly && <div className="rounded-md bg-amber-50 p-4 text-sm text-amber-800">
                      <p>
                        Al continuar, aceptas realizar donaciones mensuales recurrentes hasta que canceles la suscripción.
                      </p>
                    </div>}
                  
                  <Button type="submit" disabled={isSubmitting || !amount && !customAmount} className="w-full bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] hover:from-[#8a76e4] hover:to-[#5d4894]">
                    {isSubmitting ? "Procesando..." : <span className="flex items-center">
                        Donar ${customAmount || amount} {isMonthly && "al mes"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>}
                  </Button>
                  
                  <p className="text-center text-xs text-gray-500">
                    Tus datos de pago están seguros y protegidos
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold">Gracias a nuestros donantes</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Estas personas y organizaciones han contribuido generosamente a nuestra comunidad.
          </p>
          
          <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                <p className="mt-3 font-medium">Donante {i}</p>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default Donations;