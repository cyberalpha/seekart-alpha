
import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Laugh, Palette, Music, Camera, Film } from "lucide-react";

const Donations = () => {
  const { toast } = useToast();

  const handleDonation = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "¡Gracias por tu donación!",
      description: "Tu apoyo es fundamental para mantener la comunidad artística.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-gray-900">
            Apoya el arte local
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-500">
            Tu donación ayuda a mantener viva la comunidad artística y contribuye al desarrollo de nuevos talentos.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] p-6 text-white">
                <h2 className="text-2xl font-bold">¿Por qué donar?</h2>
                <p className="mt-2 opacity-90">Tu contribución apoya directamente a:</p>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Palette size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Artistas visuales</h3>
                      <p className="text-sm text-gray-500">Pintores, escultores y artistas emergentes</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Music size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Músicos locales</h3>
                      <p className="text-sm text-gray-500">Bandas y solistas independientes</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Camera size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Fotógrafos</h3>
                      <p className="text-sm text-gray-500">Documentalistas y creadores visuales</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Film size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Cineastas independientes</h3>
                      <p className="text-sm text-gray-500">Creadores de cortometrajes y documentales</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Laugh size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Eventos culturales</h3>
                      <p className="text-sm text-gray-500">Festivales y exposiciones comunitarias</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9b87f5] text-white">
                      <Heart size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">100% transparente</h3>
                      <p className="text-sm text-gray-500">
                        El 85% de tu donación va directamente a los artistas, el 15% se utiliza para mantener la plataforma y organizar eventos comunitarios.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Realiza tu aportación</CardTitle>
                <CardDescription>Elige el método de donación que prefieras</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="unica">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="unica">Donación única</TabsTrigger>
                    <TabsTrigger value="mensual">Donación mensual</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="unica" className="space-y-4">
                    <form onSubmit={handleDonation} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Monto a donar</Label>
                        <RadioGroup defaultValue="100" className="grid grid-cols-3 gap-4">
                          <div>
                            <RadioGroupItem
                              value="100"
                              id="amount-100"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="amount-100"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#9b87f5]"
                            >
                              <span className="text-xl font-bold">$100</span>
                              <span className="text-xs">MXN</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="200"
                              id="amount-200"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="amount-200"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#9b87f5]"
                            >
                              <span className="text-xl font-bold">$200</span>
                              <span className="text-xs">MXN</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="500"
                              id="amount-500"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="amount-500"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#9b87f5]"
                            >
                              <span className="text-xl font-bold">$500</span>
                              <span className="text-xs">MXN</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="custom-amount">Otro monto</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="custom-amount"
                            type="number"
                            placeholder="Ingresa un monto personalizado"
                            className="pl-8"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="payment-method">Método de pago</Label>
                        <RadioGroup defaultValue="tarjeta" className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="tarjeta" id="tarjeta" />
                            <Label htmlFor="tarjeta">Tarjeta de crédito/débito</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="paypal" id="paypal" />
                            <Label htmlFor="paypal">PayPal</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="oxxo" id="oxxo" />
                            <Label htmlFor="oxxo">OXXO</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] hover:from-[#8a76e4] hover:to-[#5d4894]"
                      >
                        Donar ahora
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="mensual" className="space-y-4">
                    <form onSubmit={handleDonation} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="monthly-amount">Monto mensual</Label>
                        <RadioGroup defaultValue="50" className="grid grid-cols-3 gap-4">
                          <div>
                            <RadioGroupItem
                              value="50"
                              id="monthly-50"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="monthly-50"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#9b87f5]"
                            >
                              <span className="text-xl font-bold">$50</span>
                              <span className="text-xs">MXN/mes</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="100"
                              id="monthly-100"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="monthly-100"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#9b87f5]"
                            >
                              <span className="text-xl font-bold">$100</span>
                              <span className="text-xs">MXN/mes</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="200"
                              id="monthly-200"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="monthly-200"
                              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#9b87f5]"
                            >
                              <span className="text-xl font-bold">$200</span>
                              <span className="text-xs">MXN/mes</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="custom-monthly">Otro monto mensual</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="custom-monthly"
                            type="number"
                            placeholder="Ingresa un monto personalizado"
                            className="pl-8"
                          />
                        </div>
                      </div>
                      
                      <div className="rounded-md bg-gray-50 p-4">
                        <p className="text-sm text-gray-600">
                          Al suscribirte, aceptas realizar donaciones mensuales recurrentes hasta que decidas cancelar.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="payment-method-monthly">Método de pago</Label>
                        <RadioGroup defaultValue="tarjeta" className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="tarjeta" id="tarjeta-monthly" />
                            <Label htmlFor="tarjeta-monthly">Tarjeta de crédito/débito</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="paypal" id="paypal-monthly" />
                            <Label htmlFor="paypal-monthly">PayPal</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <Button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] hover:from-[#8a76e4] hover:to-[#5d4894]"
                      >
                        Suscribirme ahora
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="mb-3 text-2xl font-bold">Gracias a nuestros patrocinadores</h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-500">
            Estas personas y organizaciones han contribuido generosamente a nuestra comunidad.
          </p>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                <p className="mt-2 font-medium">Patrocinador {i}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donations;
