import { useTranslation } from 'react-i18next';

const LoadingSpinner = ({ size = 'md', message = null, fullPage = false }) => {
  const { t } = useTranslation();
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const containerClass = fullPage
    ? 'flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900'
    : 'flex flex-col items-center justify-center py-12';

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div className={`${sizeClasses[size]} border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin`}></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">{message || t('loadingSpinner.loading')}</p>
      <span className="sr-only">{t('loadingSpinner.srOnly')}</span>
    </div>
  );
};

export default LoadingSpinner;
