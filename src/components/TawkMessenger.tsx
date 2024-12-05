import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: any;
  }
}

export function TawkMessenger() {
  useEffect(() => {
    // Configuração do Tawk.to
    var s1 = document.createElement("script");
    var s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/_s/v4/app/67354992019/js/twk-main.js';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode?.insertBefore(s1, s0);

    // Carrega o script do vendor
    var s2 = document.createElement("script");
    s2.async = true;
    s2.src = 'https://embed.tawk.to/_s/v4/app/67354992019/js/twk-vendor.js';
    s2.charset = 'UTF-8';
    s2.setAttribute('crossorigin', '*');
    s0.parentNode?.insertBefore(s2, s0);

    // Configuração da API do Tawk
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
  }, []);

  return null; // Este componente não renderiza nada visualmente
}
