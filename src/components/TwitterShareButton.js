import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const TwitterShareButton = ({ title, url, hashtags = [] }) => {
  const { t } = useTranslation();

  const handleShare = () => {
    // Build Twitter intent URL
    let twitterUrl = 'https://twitter.com/intent/tweet?';

    // Add text (article title)
    if (title) {
      twitterUrl += `text=${encodeURIComponent(title)}`;
    }

    // Add URL
    if (url) {
      twitterUrl += `&url=${encodeURIComponent(url)}`;
    }

    // Add hashtags (optional)
    if (hashtags.length > 0) {
      twitterUrl += `&hashtags=${hashtags.join(',')}`;
    }

    // Open in new window with specific dimensions
    const width = 550;
    const height = 420;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      twitterUrl,
      'twitter-share',
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,status=0`
    );
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      aria-label={t('share.shareOnTwitter')}
      title={t('share.shareOnTwitter')}
    >
      {/* Twitter/X Icon */}
      <svg
        className="w-4 h-4 mr-1.5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      <span className="hidden sm:inline">{t('share.shareTwitter')}</span>
      <span className="sm:hidden">{t('share.share')}</span>
    </button>
  );
};

TwitterShareButton.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  hashtags: PropTypes.arrayOf(PropTypes.string)
};

export default TwitterShareButton;
