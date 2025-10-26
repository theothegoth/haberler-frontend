import { useTranslation } from 'react-i18next';

const LoadingSpinner = ({ size = 'md', message = null }) => {
  const { t } = useTranslation();
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12" role="status" aria-live="polite">
      <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
      <p className="mt-4 text-gray-600">{message || t('loadingSpinner.loading')}</p>
      <span className="sr-only">{t('loadingSpinner.srOnly')}</span>
    </div>
  );
};

export default LoadingSpinner;
