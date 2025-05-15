import React, { useEffect, useState } from 'react';

const GoogleAuthCheck: React.FC = () => {
  const [clientId, setClientId] = useState<string>('');
  const [googleApiStatus, setGoogleApiStatus] = useState<string>('Checking...');
  const [oauthPackageStatus, setOauthPackageStatus] = useState<string>('Checking...');
  
  useEffect(() => {
    // Check if Google client ID is available
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    setClientId(googleClientId ? 'Available' : 'Not Available');
    
    // Check if Google API is loaded
    const timer1 = setTimeout(() => {
      if ((window as any).google) {
        setGoogleApiStatus('Loaded');
      } else {
        setGoogleApiStatus('Not Loaded');
      }
    }, 2000);
    
    // Check if OAuth package is working
    const timer2 = setTimeout(() => {
      try {
        if (typeof (window as any).gapi !== 'undefined') {
          setOauthPackageStatus('Library initialized');
        } else {
          setOauthPackageStatus('Library not initialized');
        }
      } catch (error) {
        setOauthPackageStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md mb-4">
      <h3 className="font-bold mb-2">Google Auth Status</h3>
      <ul className="space-y-1 text-sm">
        <li>
          <span className="font-medium">Google Client ID:</span>{' '}
          <span className={clientId === 'Available' ? 'text-green-700' : 'text-red-700'}>
            {clientId}
          </span>
        </li>
        <li>
          <span className="font-medium">Google API:</span>{' '}
          <span className={googleApiStatus === 'Loaded' ? 'text-green-700' : googleApiStatus === 'Checking...' ? 'text-yellow-700' : 'text-red-700'}>
            {googleApiStatus}
          </span>
        </li>
        <li>
          <span className="font-medium">OAuth Package:</span>{' '}
          <span className={oauthPackageStatus.includes('initialized') ? 'text-green-700' : oauthPackageStatus === 'Checking...' ? 'text-yellow-700' : 'text-red-700'}>
            {oauthPackageStatus}
          </span>
        </li>
      </ul>
      
      <div className="mt-3 text-xs">
        {clientId !== 'Available' && (
          <p className="text-red-700">
            <strong>Fix needed:</strong> Add VITE_GOOGLE_CLIENT_ID to environment variables.
          </p>
        )}
      </div>
    </div>
  );
};

export default GoogleAuthCheck;