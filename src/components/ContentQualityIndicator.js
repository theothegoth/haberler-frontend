import { useTranslation } from 'react-i18next';
import { analyzeContentQuality, getQualityBadge } from '../utils/contentQuality';

const ContentQualityIndicator = ({ title, content, imageCount = 0, videoCount = 0 }) => {
  const { t } = useTranslation();
  const analysis = analyzeContentQuality(title || '', content || '');
  const badge = getQualityBadge(analysis);

  // Check media requirement
  const hasMedia = imageCount > 0 || videoCount > 0;
  const mediaWarning = !hasMedia ? {
    type: 'media',
    severity: 'error',
    messageKey: 'contentQuality.mediaRequired',
    params: {}
  } : null;

  // Combine all warnings
  const allWarnings = mediaWarning
    ? [...analysis.warnings, mediaWarning]
    : analysis.warnings;

  // Check if we have any errors (including media requirement)
  const hasErrors = allWarnings.some(w => w.severity === 'error');

  if (!title && !content) {
    return null;
  }

  const getBadgeClasses = (color) => {
    const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';
    const colorClasses = {
      red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return `${baseClasses} ${colorClasses[color] || colorClasses.blue}`;
  };

  const getWarningClasses = (severity) => {
    const baseClasses = 'flex items-start gap-2 p-3 rounded-lg text-sm';
    const severityClasses = {
      error: 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900 dark:bg-opacity-20 dark:border-red-600 dark:text-red-300',
      warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-20 dark:border-yellow-600 dark:text-yellow-300'
    };
    return `${baseClasses} ${severityClasses[severity] || severityClasses.warning}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
      {/* Quality Badge */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Content Quality
        </h3>
        <span className={getBadgeClasses(badge.color)}>
          <span className="mr-1">{badge.icon}</span>
          {t(badge.textKey)}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <div className="text-gray-500 dark:text-gray-400">Title</div>
          <div className={`font-medium ${analysis.stats.titleLength < 20 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
            {analysis.stats.titleLength} chars
          </div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Content</div>
          <div className={`font-medium ${analysis.stats.contentLength < 500 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
            {analysis.stats.contentLength} chars
          </div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Paragraphs</div>
          <div className={`font-medium ${analysis.stats.paragraphCount < 2 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
            {analysis.stats.paragraphCount}
          </div>
        </div>
      </div>

      {/* Warnings */}
      {allWarnings.length > 0 && (
        <div className="space-y-2">
          {allWarnings.map((warning, index) => (
            <div key={index} className={getWarningClasses(warning.severity)}>
              <span className="flex-shrink-0 mt-0.5">
                {warning.severity === 'error' ? '❌' : '⚠️'}
              </span>
              <span className="flex-1">{t(warning.messageKey, warning.params)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Success Message */}
      {!hasErrors && !analysis.hasWarnings && hasMedia && (
        <div className="flex items-start gap-2 p-3 rounded-lg text-sm bg-green-50 border border-green-200 text-green-800 dark:bg-green-900 dark:bg-opacity-20 dark:border-green-600 dark:text-green-300">
          <span className="flex-shrink-0 mt-0.5">✅</span>
          <span className="flex-1">{t('contentQuality.meetsRequirements')}</span>
        </div>
      )}
    </div>
  );
};

export default ContentQualityIndicator;
