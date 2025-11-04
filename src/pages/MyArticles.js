import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import newsService from '../services/newsService';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import TwitterShareButton from '../components/TwitterShareButton';

const MyArticles = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 12;

  const loadArticles = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setOffset(0);
      } else {
        setLoadingMore(true);
      }

      const currentOffset = reset ? 0 : offset;
      const data = await newsService.getMyArticles(LIMIT, currentOffset);

      if (reset) {
        setArticles(data);
      } else {
        setArticles(prev => [...prev, ...data]);
      }

      setHasMore(data.length === LIMIT);
      if (!reset) {
        setOffset(prev => prev + LIMIT);
      } else {
        setOffset(LIMIT);
      }
    } catch (err) {
      setError(err.response?.data?.error || t('myArticles.loadError'));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [offset, t]);

  useEffect(() => {
    loadArticles(true);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('myArticles.confirmDelete'))) return;

    try {
      await newsService.deleteNews(id);
      loadArticles(true);
    } catch (err) {
      alert(err.response?.data?.error || t('myArticles.deleteErrorGeneral'));
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadArticles(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('myArticles.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{t('myArticles.subtitle')}</p>
          </div>
          <Link
            to="/write"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>{t('myArticles.writeNewArticle')}</span>
          </Link>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('myArticles.stats.articles')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{articles.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('myArticles.stats.totalLikes')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {articles.reduce((sum, a) => sum + (parseInt(a.like_count) || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('myArticles.stats.totalComments')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {articles.reduce((sum, a) => sum + (parseInt(a.comment_count) || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Articles List */}
        {articles.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('myArticles.noArticles')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{t('myArticles.writeFirst')}</p>
            <Link
              to="/write"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              {t('myArticles.writeArticle')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <Link
                  to={`/article/${article.id}`}
                  className="block hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                {article.image_url && (
                  <img
                    src={article.image_url.startsWith('http') ? article.image_url : `http://localhost:5000${article.image_url}`}
                    alt={article.title}
                    className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-700"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                  <div className="p-6">
                  {article.category && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {article.category}
                    </span>
                  )}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-3 mb-2 line-clamp-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                      {article.title}
                    </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                    {article.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{new Date(article.created_at).toLocaleDateString('tr-TR')}</span>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span>{article.like_count}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" />
                        </svg>
                        <span>{article.comment_count}</span>
                      </span>
                    </div>
                  </div>
                  </div>
                </Link>
                <div className="px-6 pb-6 space-y-2">
                    <TwitterShareButton
                      title={article.title}
                      url={`${window.location.origin}/news/${article.id}`}
                      hashtags={['Gaste', 'News']}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/edit-article/${article.id}`)}
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
                      >
                        {t('myArticles.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="flex-1 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors text-sm font-medium"
                      >
                        {t('myArticles.delete')}
                      </button>
                    </div>
                  </div>
                </article>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {articles.length > 0 && hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? t('myArticles.loading') : t('myArticles.loadMore')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyArticles;
