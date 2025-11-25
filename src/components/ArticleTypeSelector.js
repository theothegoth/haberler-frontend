import { useTranslation } from 'react-i18next';

const ArticleTypeSelector = ({ value, onChange, className = '' }) => {
  const { t } = useTranslation();

  const articleTypes = [
    { value: 'news', icon: '📰', label: t('articleType.news'), description: t('articleType.newsDesc') },
    { value: 'opinion', icon: '💭', label: t('articleType.opinion'), description: t('articleType.opinionDesc') },
    { value: 'analysis', icon: '📊', label: t('articleType.analysis'), description: t('articleType.analysisDesc') },
    { value: 'interview', icon: '🎤', label: t('articleType.interview'), description: t('articleType.interviewDesc') },
    { value: 'editorial', icon: '📝', label: t('articleType.editorial'), description: t('articleType.editorialDesc') }
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('articleType.selectType')} <span className="text-red-500">*</span>
      </label>
      <select
        value={value || 'news'}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        required
      >
        {articleTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.icon} {type.label} - {type.description}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {t('articleType.helperText')}
      </p>
    </div>
  );
};

export default ArticleTypeSelector;
