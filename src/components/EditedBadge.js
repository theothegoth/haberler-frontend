import { useTranslation } from 'react-i18next';

/**
 * EditedBadge - Shows when an article has been edited
 * @param {string} createdAt - ISO timestamp when article was created
 * @param {string} updatedAt - ISO timestamp when article was last updated
 * @param {string} size - 'sm' or 'md' for different sizes
 * @param {string} className - Additional CSS classes
 */
const EditedBadge = ({ createdAt, updatedAt, size = 'sm', className = '' }) => {
  const { t, i18n } = useTranslation();

  if (!createdAt || !updatedAt) return null;

  const created = new Date(createdAt);
  const updated = new Date(updatedAt);

  // Grace period: 5 minutes for immediate typo fixes
  const GRACE_PERIOD_MS = 5 * 60 * 1000;
  const timeDiff = updated - created;

  // Don't show badge if article wasn't actually edited (beyond grace period)
  if (timeDiff < GRACE_PERIOD_MS) return null;

  // Format the edited time
  const formatEditedTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return t('article.editedMinutesAgo', { count: diffMins });
    } else if (diffHours < 24) {
      return t('article.editedHoursAgo', { count: diffHours });
    } else if (diffDays < 30) {
      return t('article.editedDaysAgo', { count: diffDays });
    } else {
      // Show formatted date for older edits
      return t('article.editedOn', {
        date: date.toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      });
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 font-medium ${sizeClasses[size]} ${className}`}
      title={t('article.lastEdited', { date: updated.toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US') })}
    >
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
      <span>{formatEditedTime(updated)}</span>
    </span>
  );
};

export default EditedBadge;
