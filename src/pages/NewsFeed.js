import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import newsService from '../services/newsService';
import followService from '../services/followService';
import bookmarkService from '../services/bookmarkService';
import ProtectedContent from '../components/ProtectedContent';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import TwitterShareButton from '../components/TwitterShareButton';
import Comments from '../components/Comments';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';

const NewsFeed = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [feed, setFeed] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 10;

  const loadFeed = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setOffset(0);
      } else {
        setLoadingMore(true);
      }

      const currentOffset = reset ? 0 : offset;
      const data = await newsService.getNewsFeed(LIMIT, currentOffset);

      if (reset) {
        setFeed(data);
      } else {
        setFeed(prev => [...prev, ...data]);
      }

      setHasMore(data.length === LIMIT);
      if (!reset) {
        setOffset(prev => prev + LIMIT);
      } else {
        setOffset(LIMIT);
      }
    } catch (err) {
      setError(t('errors.feedLoadError'));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [offset, t]);

  const loadSuggested = useCallback(async () => {
    try {
      const data = await followService.getSuggestedUsers(5);
      setSuggested(data);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    }
  }, []);

  useEffect(() => {
    loadFeed(true);
    loadSuggested();
  }, [loadSuggested]);

  const handleFollow = async (userId) => {
    try {
      await followService.followUser(userId);
      // Refresh suggested users and feed
      loadSuggested();
      loadFeed(true);
    } catch (err) {
      console.error('Follow error:', err);
      setError(t('errors.followError') || 'Failed to follow user');
    }
  };

  const handleLike = async (newsId, currentlyLiked) => {
    try {
      if (currentlyLiked) {
        await newsService.unlikeNews(newsId);
      } else {
        await newsService.likeNews(newsId);
      }
      loadFeed(true);
    } catch (err) {
      console.error('Like error:', err);
    }
  };


  const handleBookmark = async (newsId) => {
    try {
      await bookmarkService.saveArticle(newsId);
      // Optionally show a success message
    } catch (error) {
      console.error('Bookmark error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadFeed(false);
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
      { key: 'time.yearsAgo', seconds: 31536000 },
      { key: 'time.monthsAgo', seconds: 2592000 },
      { key: 'time.weeksAgo', seconds: 604800 },
      { key: 'time.daysAgo', seconds: 86400 },
      { key: 'time.hoursAgo', seconds: 3600 },
      { key: 'time.minutesAgo', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${t(interval.key)}`;
      }
    }
    return t('time.justNow');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <SEO
        title="News Feed"
        description="Read news articles from journalists and writers you follow. Stay updated with the latest news."
        keywords="news feed, articles, journalism, latest news"
        url="https://gaste.com/feed"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('newsFeed.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t('newsFeed.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feed */}
          <div className="lg:col-span-2 space-y-6">
            {error && <ErrorMessage message={error} />}

            {feed.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('newsFeed.noNews')}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{t('newsFeed.noNewsMessage')}</p>
                <button
                  onClick={() => navigate('/explore')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  {t('newsFeed.exploreAuthors')}
                </button>
              </div>
            ) : (
              feed.map((news) => (
                <article
                  key={news.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Author header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <Link
                      to={`/user/${news.user_id}`}
                      className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {news.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{news.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatTimeAgo(news.created_at)}</p>
                      </div>
                    </Link>
                    {news.category && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {news.category}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <Link
                    to={`/article/${news.id}`}
                    className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 cursor-pointer">
                      {news.title}
                    </h2>
                    {news.image_url && (
                      <img
                        src={news.image_url.startsWith('http') ? news.image_url : `http://localhost:5000${news.image_url}`}
                        alt={news.title}
                        className="w-full h-64 object-contain bg-gray-100 dark:bg-gray-700 rounded-lg mb-4"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                    <p className="text-gray-700 dark:text-gray-200 line-clamp-3 mb-4">
                      {news.content}
                    </p>
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      {t('newsFeed.readMore')} →
                    </span>
                  </Link>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-between border-t">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLike(news.id, news.user_has_liked)}
                        className={`flex items-center space-x-2 transition-colors ${
                          news.user_has_liked ? 'text-red-500' : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
                        }`}
                      >
                        <svg className="w-6 h-6" fill={news.user_has_liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{news.like_count}</span>
                      </button>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{news.comment_count}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleBookmark(news.id);
                        }}
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-yellow-500 transition-colors"
                        title={t('bookmark.saveArticle')}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                      </div>
                    </div>
                    <TwitterShareButton
                      title={news.title}
                      url={`${window.location.origin}/news/${news.id}`}
                      hashtags={['Gaste', 'News']}
                    />
                  </div>
                </article>
              ))
            )}

            {/* Load More Button */}
            {feed.length > 0 && hasMore && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? t('newsFeed.loading') : t('newsFeed.loadMore')}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Users */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('newsFeed.suggestedUsers')}</h3>
              <div className="space-y-4">
                {suggested.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <Link to={`/user/${user.id}`} className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{user.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.news_count} {t('newsFeed.newsCount')}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleFollow(user.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors"
                    >
                      {t('newsFeed.follow')}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-3">{t('newsFeed.writeYourOwn')}</h3>
              <p className="text-sm mb-4 opacity-90">
                {t('newsFeed.writeYourOwnDesc')}
              </p>
              <button
                onClick={() => navigate('/write')}
                className="w-full bg-white dark:bg-gray-800 text-purple-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('newsFeed.writeNews')}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  );
};

export default NewsFeed;
