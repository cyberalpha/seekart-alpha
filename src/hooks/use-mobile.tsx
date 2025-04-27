
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Detectar inicialmente usando el ancho de la ventana si está disponible
    if (typeof window !== 'undefined') {
      console.log('Ancho inicial de la ventana:', window.innerWidth);
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    // Fallback a false si window no está disponible
    return false;
  });

  React.useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /mobile|android|ios|iphone|ipad|ipod|windows phone/i.test(userAgent);
      
      console.log('Verificación de móvil:', {
        width,
        userAgent,
        isMobileDevice,
        mediaQuery: window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
      });

      setIsMobile(width < MOBILE_BREAKPOINT);
    };

    // Verificar inmediatamente
    checkMobile();

    // Configurar listener para cambios de tamaño
    const resizeObserver = new ResizeObserver(() => {
      checkMobile();
    });

    resizeObserver.observe(document.body);

    // Limpiar
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return isMobile;
}
