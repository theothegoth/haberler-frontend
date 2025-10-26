import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import youtubeService from '../services/youtubeService';
import LoadingSpinner from './LoadingSpinner';

function AddChannelForm({ onAdded }) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error'); // 'error' or 'success'
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!input.trim()) {
      setMessage(t('addChannelForm.enterChannelInfo'));
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);
      const response = await youtubeService.addUserChannel(input.trim());
      setMessage(response.message || t('addChannelForm.channelAddedSuccess'));
      setMessageType('success');
      setInput('');

      // Call the onAdded callback after a short delay to show success message
      setTimeout(() => {
        if (onAdded) onAdded();
        setMessage('');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || error.message || t('addChannelForm.errorOccurred'));
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex items-center max-w-md mx-auto">
        <input
          type="text"
          placeholder={t('addChannelForm.placeholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-label={t('addChannelForm.ariaLabel')}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={t('addChannelForm.submitAria')}
        >
          {loading ? t('addChannelForm.adding') : t('common.addChannel')}
        </button>
      </form>

      {loading && (
        <div className="mt-4 flex justify-center">
          <LoadingSpinner size="sm" message={t('addChannelForm.addingChannel')} />
        </div>
      )}

      {message && !loading && (
        <p
          className={`mt-2 text-center text-sm ${
            messageType === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
          role="alert"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </div>
  );
}

AddChannelForm.propTypes = {
  onAdded: PropTypes.func,
};

export default AddChannelForm;
