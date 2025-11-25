import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import bookmarkService from '../services/bookmarkService';
import LoadingSpinner from '../components/LoadingSpinner';
import TwitterShareButton from '../components/TwitterShareButton';
import EditedBadge from '../components/EditedBadge';
import SEO from '../components/SEO';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const SavedArticles = () => {
  const { t } = useTranslation();

  // Helper to strip HTML tags for preview
  const stripHTML = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = DOMPurify.sanitize(html);
    return tmp.textContent || tmp.innerText || '';
  };
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 20;

  useEffect(() => {
    fetchSavedArticles();
  }, []);

  const fetchSavedArticles = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const currentOffset = isLoadMore ? offset : 0;
      const data = await bookmarkService.getSavedArticles(limit, currentOffset);

      if (isLoadMore) {
        setArticles([...articles, ...(data.articles || [])]);
      } else {
        setArticles(data.articles || []);
      }

      setHasMore(data.hasMore || false);
      setOffset(currentOffset + limit);
      setError(null);
    } catch (error) {
      console.error('Error fetching saved articles:', error);
      setError(t('common.error'));
      setArticles([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleRemoveBookmark = async (newsId) => {
    if (!window.confirm(t('common.confirmDelete'))) return;

    try {
      await bookmarkService.unsaveArticle(newsId);
      setArticles(articles.filter(article => article.id !== newsId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
      alert(t('common.error'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <SEO
        title={t('savedArticles.title')}
        description={t('savedArticles.subtitle')}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t('savedArticles.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('savedArticles.subtitle')}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Articles Grid */}
          {articles.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                {t('savedArticles.noArticles')}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t('savedArticles.noArticlesMessage')}
              </p>
              <Link
                to="/news-feed"
                className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                {t('newsFeed.exploreAuthors')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
                >
                  <Link
                    to={`/article/${article.id}`}
                    className="flex-grow flex flex-col hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    {article.display_thumbnail && (
                      <div className="relative">
                        <img
                          src={getImageUrl(article.display_thumbnail)}
                          alt={article.title}
                          className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-700"
                          onError={handleImageError}
                        />
                        {article.video_count > 0 && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
                               title={t('videoAttachment.hasVideo')}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-6 flex-grow flex flex-col">
                      {article.category && (
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs break-words inline-block w-fit">
                          {t(`categories.${article.category.toLowerCase()}`) || article.category}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-3 mb-2 line-clamp-2 break-words hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 break-words mb-4">
                        {stripHTML(article.content)}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
                        <div className="flex items-center gap-2">
                          <span>{new Date(article.created_at).toLocaleDateString('tr-TR')}</span>
                          <EditedBadge
                            createdAt={article.created_at}
                            updatedAt={article.updated_at}
                            size="sm"
                          />
                        </div>
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
                          <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            <span>{article.view_count || 0}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="px-6 pb-6 pt-2 space-y-2 mt-auto">
                    <TwitterShareButton
                      title={article.title}
                      url={`${window.location.origin}/article/${article.id}`}
                      hashtags={['Gaste', 'News']}
                    />
                    <button
                      onClick={() => handleRemoveBookmark(article.id)}
                      className="w-full px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors text-sm font-medium"
                    >
                      {t('savedArticles.remove')}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && articles.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => fetchSavedArticles(true)}
                disabled={loadingMore}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? t('savedArticles.loading') : t('savedArticles.loadMore')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SavedArticles;
