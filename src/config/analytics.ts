export const analyticsConfig = {
  // Google Analytics
  googleAnalytics: {
    id: 'G-XXXXXXXXXX', // Substitua pelo seu ID do GA4
  },
  
  // Hotjar
  hotjar: {
    id: 'XXXXXXX', // Substitua pelo seu ID do Hotjar
    version: 6,
  },
  
  // Facebook Pixel
  facebookPixel: {
    id: 'XXXXXXXXXXXXXXXXXX', // Substitua pelo seu ID do Pixel
  },
  
  // TinyMCE
  tinyMCE: {
    apiKey: 'your-api-key', // Substitua pela sua chave da API
  },
  
  // Pusher
  pusher: {
    key: 'your-pusher-key',
    cluster: 'us2',
  },

  // Sentry
  sentry: {
    dsn: 'https://your-dsn.ingest.sentry.io/xxxxx',
    environment: 'production',
  },

  // LogRocket
  logRocket: {
    appId: 'your-app/id',
  },

  // FullStory
  fullStory: {
    orgId: 'your-org-id',
  },

  // Amplitude
  amplitude: {
    apiKey: 'your-api-key',
  },

  // PostHog
  postHog: {
    apiKey: 'phc_your_api_key',
    host: 'https://app.posthog.com',
  },

  // ClearBit
  clearbit: {
    apiKey: 'your-api-key',
  },

  // Segment
  segment: {
    writeKey: 'your-write-key',
  }
};

export const intercomConfig = {
  appId: process.env.VITE_INTERCOM_APP_ID || 'your-app-id',
  apiKey: process.env.VITE_INTERCOM_API_KEY || 'your-api-key',
  enabled: true,
};
