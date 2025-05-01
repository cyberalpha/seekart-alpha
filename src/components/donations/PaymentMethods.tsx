import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
const PaymentMethods = () => {
  const {
    toast
  } = useToast();
  const isMobile = useIsMobile();
  const [copyState, setCopyState] = useState<{
    [key: string]: boolean;
  }>({});
  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);

    // Update copy state for visual feedback
    setCopyState({
      ...copyState,
      [label]: true
    });

    // Show toast notification
    toast({
      title: "¡Copiado!",
      description: `La dirección de ${label} ha sido copiada al portapapeles.`
    });

    // Reset copy state after animation
    setTimeout(() => {
      setCopyState({
        ...copyState,
        [label]: false
      });
    }, 2000);
  };
  return <div className={`grid gap-4 ${isMobile ? 'px-2' : ''} md:gap-6 ${isMobile ? '' : 'md:grid-cols-2'}`}>
      <Card className="w-full transform hover:scale-[1.01] shadow-md hover:shadow-lg transition-all border-seekart-blue/10">
        <CardHeader className="bg-gradient-to-r from-seekart-blue/5 to-white">
          <CardTitle>Mercado Pago y PayPal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <h3 className="font-medium">Mercado Pago</h3>
            <Button className="w-full bg-gradient-to-r from-seekart-blue to-seekart-green hover:opacity-90" onClick={() => window.open("https://mpago.la/166iWvu", "_blank")}>Donar</Button>
            <p className="text-sm text-muted-foreground">
              Haz clic en el botón para realizar tu donación a través de Mercado Pago
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">PayPal</h3>
            <Button className="w-full bg-gradient-to-r from-seekart-blue to-seekart-purple hover:opacity-90" onClick={() => window.open("https://www.paypal.com/paypalme/cristophelico", "_blank")}>
              Donar
            </Button>
            <p className="text-sm text-muted-foreground">
              Haz clic en el botón para realizar tu donación a través de PayPal
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-all border-seekart-green/10">
        <CardHeader className="bg-gradient-to-r from-seekart-green/5 to-white">
          <CardTitle>Transferencia Bancaria U$S</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <h3 className="font-medium">Cuenta Bancaria Argentina</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Banco:</strong> Galicia</p>
              <p><strong>CBU:</strong> 0070107131004016191808</p>
              <p><strong>Alias:</strong> MATE.BAHIA.CATAPLERA</p>
            </div>
            <p className="text-sm text-muted-foreground">Por favor, envíanos el comprobante de transferencia al correo electrónico programandote@gmail.com para agilizar el proceso.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-all border-seekart-orange/10">
        <CardHeader className="bg-gradient-to-r from-seekart-orange/5 to-white">
          <CardTitle>Tarjeta de Crédito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <p className="text-sm text-muted-foreground">
            Estamos trabajando para implementar pagos directos con tarjeta. Por el momento, puedes realizar tu donación a través de Mercado Pago o PayPal.
          </p>
          <Button disabled className="w-full bg-gradient-to-r from-seekart-orange to-seekart-red opacity-70 cursor-not-allowed">
            Próximamente
          </Button>
          <p className="text-sm text-muted-foreground italic">
            Esta funcionalidad estará disponible pronto.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-all border-seekart-purple/10">
        <CardHeader className="bg-gradient-to-r from-seekart-purple/5 to-white">
          <CardTitle>Criptomonedas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {[{
          name: "USDT (Tether)",
          address: "0x850ed63ae1f72902543bc665311fe95e19a02c8f"
        }, {
          name: "USD Coin (USDC)",
          address: "0x850ed63ae1f72902543bc665311fe95e19a02c8f"
        }, {
          name: "First Digital USD (FDUSD)",
          address: "0x850ed63ae1f72902543bc665311fe95e19a02c8f"
        }].map(crypto => <div key={crypto.name} className="space-y-2">
              <h3 className="font-medium">{crypto.name}</h3>
              <div className="flex items-center gap-2">
                <code className={`flex-1 rounded bg-muted p-2 text-xs ${isMobile ? 'truncate' : ''}`} title={crypto.address}>
                  {isMobile ? `${crypto.address.substring(0, 16)}...${crypto.address.substring(crypto.address.length - 8)}` : crypto.address}
                </code>
                <Button variant="outline" size="icon" className={`border-seekart-purple/20 hover:bg-seekart-purple/10 hover:border-seekart-purple/30 transition-all ${copyState[crypto.name] ? 'bg-green-100' : ''}`} onClick={() => handleCopyToClipboard(crypto.address, crypto.name)}>
                  {copyState[crypto.name] ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>)}
          
          <div className="space-y-2 pt-4 border-t">
            <h3 className="font-medium">Compra la criptomoneda XTOF</h3>
            <p className="text-sm text-muted-foreground">
              ¿Quieres apoyarnos comprando nuestra criptomoneda nativa?
            </p>
            <div className="flex items-center gap-2">
              <code className={`flex-1 rounded bg-muted p-2 text-xs ${isMobile ? 'truncate' : ''}`} title="0x5B015aE60Fe3CdAe53eead9aaC0c500b8298126D">
                {isMobile ? "0x5B015aE60Fe3...8298126D" : "0x5B015aE60Fe3CdAe53eead9aaC0c500b8298126D"}
              </code>
              <Button variant="outline" size="icon" className={`border-seekart-purple/20 hover:bg-seekart-purple/10 hover:border-seekart-purple/30 transition-all ${copyState["XTOF"] ? 'bg-green-100' : ''}`} onClick={() => handleCopyToClipboard("0x5B015aE60Fe3CdAe53eead9aaC0c500b8298126D", "XTOF")}>
                {copyState["XTOF"] ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button className="w-full bg-gradient-to-r from-seekart-red to-seekart-purple hover:opacity-90" onClick={() => window.open("https://pancakeswap.finance/swap?inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0x5B015aE60Fe3CdAe53eead9aaC0c500b8298126D", "_blank")}>
              Comprar XTOF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default PaymentMethods;