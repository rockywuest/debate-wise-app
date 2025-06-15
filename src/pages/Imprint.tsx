
import { useEffect } from 'react';

const Imprint = () => {
  useEffect(() => {
    // Redirect to external imprint page
    window.location.href = 'https://frechundwuest.de/impressum/';
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-gray-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Redirecting to Imprint...</p>
        <p className="text-sm text-gray-600 mt-2">
          If you are not redirected automatically, 
          <a href="https://frechundwuest.de/impressum/" className="text-[#2563EB] hover:underline ml-1">
            click here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Imprint;
