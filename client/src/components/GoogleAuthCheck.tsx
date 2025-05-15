import React, { useEffect, useState } from 'react';

const GoogleAuthCheck: React.FC = () => {
  const [clientId, setClientId] = useState<string>('');
  
  useEffect(() => {
    // Check if Google client ID is available
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    setClientId(googleClientId ? 'Available' : 'Not Available');
  }, []);

  return (
    <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
      <h3 className="font-bold">Google Auth Status</h3>
      <p>Google Client ID: {clientId}</p>
    </div>
  );
};

export default GoogleAuthCheck;