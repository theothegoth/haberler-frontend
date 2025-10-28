import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const VerifyEmailRequired = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResendEmail = async () => {
    setResending(true);
    setMessage('');
    setError('');

    try {
      const response = await apiClient.post('/email/resend');
      setMessage(response.data.message || t('auth.emailVerification.banner.sentSuccess'));

      // Auto-clear message after 5 seconds
      setTimeout(() => {
        setMessage('');
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.error || t('auth.emailVerification.banner.sentError'));

      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setResending(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-lg">
          <div className="text-center">
            {/* Email Icon */}
            <div className="flex justify-center mb-4">
              <svg
                className="h-24 w-24 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('auth.emailVerification.required.title')}
            </h2>

            {/* User email */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {user?.email}
            </p>

            {/* Message */}
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('auth.emailVerification.required.message')}
            </p>

            {/* Success/Error Messages */}
            {message && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 dark:bg-opacity-20 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-md text-sm">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                {t('auth.emailVerification.required.instructions')}
              </h3>
              <ol className="list-decimal list-inside text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>{t('auth.emailVerification.required.step1')}</li>
                <li>{t('auth.emailVerification.required.step2')}</li>
                <li>{t('auth.emailVerification.required.step3')}</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleResendEmail}
                disabled={resending}
                className="w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t('auth.emailVerification.banner.sending')}
                  </>
                ) : (
                  t('auth.emailVerification.banner.resend')
                )}
              </button>

              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('auth.emailVerification.required.logout')}
              </button>
            </div>

            {/* Help Text */}
            <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              {t('auth.emailVerification.required.helpText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailRequired;
