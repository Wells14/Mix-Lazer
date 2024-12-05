import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { intercomConfig } from '@/config/analytics';

declare global {
  interface Window {
    Intercom: any;
  }
}

export function CustomerSupport() {
  useEffect(() => {
    if (intercomConfig.enabled && window.Intercom) {
      window.Intercom('boot', {
        app_id: intercomConfig.appId,
        // Add any user data here
        name: "Test User",
        email: "test@example.com",
        created_at: new Date().getTime()
      });
    }
  }, []);

  const handleSupportClick = () => {
    if (window.Intercom) {
      window.Intercom('show');
    }
  };

  return (
    <Button
      onClick={handleSupportClick}
      className="fixed bottom-4 right-4 rounded-full p-4 bg-primary hover:bg-primary/90"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}
