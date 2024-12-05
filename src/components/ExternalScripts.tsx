import { useEffect } from 'react';
import { analyticsConfig } from '@/config/analytics';

declare global {
  interface Window {
    amplitude: any;
    FS: any;
    gtag: any;
    hj: Function;
    fbq: Function;
    Swal: any;
    Chart: any;
    XLSX: any;
    pdfMake: any;
    Pusher: any;
    LogRocket: any;
    posthog: any;
    Clearbit: any;
    analytics: any;
  }
}

export function ExternalScripts() {
  useEffect(() => {
    // Google Analytics
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.googleAnalytics.id}`;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', analyticsConfig.googleAnalytics.id);

    // Hotjar
    const hotjarScript = document.createElement('script');
    hotjarScript.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${analyticsConfig.hotjar.id},hjsv:${analyticsConfig.hotjar.version}};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;
    document.head.appendChild(hotjarScript);

    // Facebook Pixel
    const fbPixelScript = document.createElement('script');
    fbPixelScript.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${analyticsConfig.facebookPixel.id}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(fbPixelScript);

    // SweetAlert2
    const sweetalertScript = document.createElement('script');
    sweetalertScript.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    document.head.appendChild(sweetalertScript);

    // Chart.js
    const chartScript = document.createElement('script');
    chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    document.head.appendChild(chartScript);

    // XLSX
    const xlsxScript = document.createElement('script');
    xlsxScript.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    document.head.appendChild(xlsxScript);

    // PDFMake
    const pdfMakeScript = document.createElement('script');
    pdfMakeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js';
    document.head.appendChild(pdfMakeScript);

    const pdfFontsScript = document.createElement('script');
    pdfFontsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js';
    document.head.appendChild(pdfFontsScript);

    // Pusher
    const pusherScript = document.createElement('script');
    pusherScript.src = 'https://js.pusher.com/8.2.0/pusher.min.js';
    document.head.appendChild(pusherScript);

    // Sentry
    const sentryScript = document.createElement('script');
    sentryScript.src = 'https://browser.sentry-cdn.com/7.0.0/bundle.min.js';
    sentryScript.crossOrigin = 'anonymous';
    document.head.appendChild(sentryScript);

    sentryScript.onload = () => {
      window.Sentry?.init({
        dsn: analyticsConfig.sentry.dsn,
        environment: analyticsConfig.sentry.environment,
      });
    };

    // LogRocket
    const logRocketScript = document.createElement('script');
    logRocketScript.src = 'https://cdn.lr-in.com/LogRocket.min.js';
    document.head.appendChild(logRocketScript);

    logRocketScript.onload = () => {
      window.LogRocket?.init(analyticsConfig.logRocket.appId);
    };

    // FullStory
    const fullStoryScript = document.createElement('script');
    fullStoryScript.innerHTML = `
      window['_fs_host'] = 'fullstory.com';
      window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
      window['_fs_org'] = '${analyticsConfig.fullStory.orgId}';
      window['_fs_namespace'] = 'FS';
      (function(m,n,e,t,l,o,g,y){
        g=m[e]=function(a,b,c){g.q?g.q.push([a,b,c]):g._api(a,b,c)};g.q=[];
        o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src=
        'https://'+_fs_script;y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
        g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};
        g.event=function(i,v,s){g('event',{n:i,p:v},s)};g.anonymize=function(){g.identify(!!0)};
        g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
        g.log = function(a,b){g("log",[a,b])};
        g.consent=function(a){g("consent",!arguments.length||a)};
        g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
        g.clearUserCookie=function(){};
        g.setVars=function(n, p){g('setVars',[n,p]);};
        g._w={};y='XMLHttpRequest';g._w[y]=m[y];y='fetch';g._w[y]=m[y];
      })(window,document,'FS','script','user');
    `;
    document.head.appendChild(fullStoryScript);

    // Amplitude
    const amplitudeScript = document.createElement('script');
    amplitudeScript.src = 'https://cdn.amplitude.com/libs/amplitude-8.21.4-min.gz.js';
    document.head.appendChild(amplitudeScript);

    amplitudeScript.onload = () => {
      window.amplitude?.getInstance().init(analyticsConfig.amplitude.token);
    };

    // PostHog
    const postHogScript = document.createElement('script');
    postHogScript.innerHTML = `
      !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
      posthog.init('${analyticsConfig.postHog.apiKey}', {api_host: '${analyticsConfig.postHog.host}'});
    `;
    document.head.appendChild(postHogScript);

    // ClearBit
    const clearbitScript = document.createElement('script');
    clearbitScript.src = 'https://x.clearbitjs.com/v2/pk_${analyticsConfig.clearbit.apiKey}/clearbit.min.js';
    document.head.appendChild(clearbitScript);

    // Segment
    const segmentScript = document.createElement('script');
    segmentScript.innerHTML = `
      !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="${analyticsConfig.segment.writeKey}";analytics.SNIPPET_VERSION="4.15.3";
      analytics.load("${analyticsConfig.segment.writeKey}");
      analytics.page();
      }}();
    `;
    document.head.appendChild(segmentScript);

    // Limpeza ao desmontar
    return () => {
      document.head.removeChild(gaScript);
      document.head.removeChild(hotjarScript);
      document.head.removeChild(fbPixelScript);
      document.head.removeChild(sweetalertScript);
      document.head.removeChild(chartScript);
      document.head.removeChild(xlsxScript);
      document.head.removeChild(pdfMakeScript);
      document.head.removeChild(pdfFontsScript);
      document.head.removeChild(pusherScript);
      document.head.removeChild(sentryScript);
      document.head.removeChild(logRocketScript);
      document.head.removeChild(fullStoryScript);
      document.head.removeChild(amplitudeScript);
      document.head.removeChild(postHogScript);
      document.head.removeChild(clearbitScript);
      document.head.removeChild(segmentScript);
    };
  }, []);

  return null;
}
