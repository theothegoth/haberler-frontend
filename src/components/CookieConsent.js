import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CookieConsent = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 p-4 md:p-6 animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-300 flex-1">
          <p className="font-medium text-gray-900 dark:text-white mb-1">
            {t('cookies.title') || 'We use cookies'}
          </p>
          <p>
            {t('cookies.description') || 
             'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.'}
             {' '}
             <a href="/privacy-policy" className="text-blue-600 hover:text-blue-500 underline">
               {t('cookies.learnMore') || 'Learn more'}
             </a>
          </p>
        </div>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <button
            onClick={handleAccept}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm"
          >
            {t('cookies.accept') || 'Accept All'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

