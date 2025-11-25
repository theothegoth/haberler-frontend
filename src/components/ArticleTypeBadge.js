import { useTranslation } from 'react-i18next';

const ArticleTypeBadge = ({ type, size = 'sm', className = '' }) => {
  const { t } = useTranslation();

  const typeConfig = {
    news: {
      icon: '📰',
      colorClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      label: t('articleType.news')
    },
    opinion: {
      icon: '💭',
      colorClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      label: t('articleType.opinion')
    },
    analysis: {
      icon: '📊',
      colorClass: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      label: t('articleType.analysis')
    },
    interview: {
      icon: '🎤',
      colorClass: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      label: t('articleType.interview')
    },
    editorial: {
      icon: '📝',
      colorClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      label: t('articleType.editorial')
    }
  };

  const config = typeConfig[type] || typeConfig.news;

  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.colorClass} ${sizeClasses[size]} ${className}`}
    >
      <span className="text-sm">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};

export default ArticleTypeBadge;
