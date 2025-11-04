import { useTranslation } from 'react-i18next';
import { useNavigationBlocker } from '../context/NavigationBlockerContext';

const NavigationBlockerDialog = () => {
  const { t } = useTranslation();
  const { showDialog, blockerMessage, confirmNavigation, cancelNavigation } = useNavigationBlocker();

  if (!showDialog) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('writeNews.unsavedChanges.title')}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {blockerMessage || t('writeNews.unsavedChanges.message')}
        </p>
        <div className="flex space-x-3">
          <button
            onClick={cancelNavigation}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            {t('writeNews.unsavedChanges.stay')}
          </button>
          <button
            onClick={confirmNavigation}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            {t('writeNews.unsavedChanges.leave')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationBlockerDialog;
