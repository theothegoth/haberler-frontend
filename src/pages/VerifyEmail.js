import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom'; // Changed useParams to useSearchParams
import { useTranslation } from 'react-i18next';
import apiClient from '../services/api';

const VerifyEmail = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams(); // Use search params
  const token = searchParams.get('token'); // Get 'token' from ?token=XYZ
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setError(t('auth.emailVerification.verify.errorMessage') || 'Invalid token');
        return;
      }

      try {
        // Backend expects /api/email/verify/:token
        const response = await apiClient.get(`/email/verify/${token}`);
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        setStatus('error');
        setError(err.response?.data?.error || t('auth.emailVerification.verify.errorMessage'));
      }
    };

    verifyEmail();
  }, [token, navigate, t]);

  // ... (keep your existing JSX return) ...
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {status === 'verifying' && (
          <div>
             <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verifying...</h2>
             <div className="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        )}
        {status === 'success' && (
            <div>
                <h2 className="text-green-600 text-2xl font-bold">Success!</h2>
                <p>{message}</p>
            </div>
        )}
        {status === 'error' && (
            <div>
                <h2 className="text-red-600 text-2xl font-bold">Error</h2>
                <p>{error}</p>
                <Link to="/login" className="text-blue-600 underline mt-4 block">Go to Login</Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
