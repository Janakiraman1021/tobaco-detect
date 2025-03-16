import React, { useEffect, useState } from 'react';
import { Alert } from '../components/ui/alert';

export function ConnectivityCheck() {
  const [isServerAvailable, setIsServerAvailable] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/');
        setIsServerAvailable(response.ok);
      } catch (error) {
        setIsServerAvailable(false);
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (isServerAvailable) return null;

  return (
    <Alert type="error" className="fixed bottom-0 left-0 right-0">
      Unable to connect to server. Please check your connection.
    </Alert>
  );
}