
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentMethods = () => {
  const { toast } = useToast();

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "¡Copiado!",
      description: `La dirección de ${label} ha sido copiada al portapapeles.`
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Mercado Pago y PayPal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Mercado Pago</h3>
            <Button className="w-full">Donar</Button>
            <p className="text-sm text-muted-foreground">
              Haz clic en el botón para realizar tu donación a través de Mercado Pago
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">PayPal</h3>
            <Button className="https://www.paypal.com/paypalme/cristophelico">Donar</Button>
            <p className="text-sm text-muted-foreground">
              Haz clic en el botón para realizar tu donación a través de PayPal
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transferencia Bancaria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Cuenta Bancaria Argentina</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Banco:</strong> Galicia</p>
              <p><strong>CBU:</strong> 0070107131004016191808</p>
              <p><strong>Alias:</strong> MATE.BAHIA.CATAPLERA</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Por favor, envíanos el comprobante de transferencia al correo electrónico correo@seekart.com para agilizar el proceso.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tarjeta de Crédito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Realiza tu donación de forma rápida y segura utilizando tu tarjeta de crédito.
          </p>
          <Button className="w-full">Donar con Tarjeta</Button>
          <p className="text-sm text-muted-foreground">
            Te redirigiremos a una pasarela de pago segura para completar tu transacción.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Criptomonedas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: "USDT (Tether)", address: "0x850ed63ae1f72902543bc665311fe95e19a02c8f" },
            { name: "USD Coin (USDC)", address: "0x850ed63ae1f72902543bc665311fe95e19a02c8f" },
            { name: "First Digital USD (FDUSD)", address: "0x850ed63ae1f72902543bc665311fe95e19a02c8f" }
          ].map((crypto) => (
            <div key={crypto.name} className="space-y-2">
              <h3 className="font-medium">{crypto.name}</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-muted p-2 text-xs">{crypto.address}</code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyToClipboard(crypto.address, crypto.name)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="space-y-2 pt-4 border-t">
            <h3 className="font-medium">Compra la criptomoneda XTOF</h3>
            <p className="text-sm text-muted-foreground">
              ¿Quieres apoyarnos comprando nuestra criptomoneda nativa?
            </p>
            <code className="block rounded bg-muted p-2 text-xs">
              0x5B015aE60Fe3CdAe53eead9aaC0c500b8298126D
            </code>
            <Button
              className="w-full"
              onClick={() => window.open("https://pancakeswap.finance/swap?inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0x5B015aE60Fe3CdAe53eead9aaC0c500b8298126D", "_blank")}
            >
              Comprar XTOF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethods;
