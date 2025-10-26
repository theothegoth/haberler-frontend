import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import newsService from '../services/newsService';
import followService from '../services/followService';
import ProtectedContent from '../components/ProtectedContent';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const NewsFeed = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [feed, setFeed] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    loadFeed();
    loadSuggested();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const data = await newsService.getNewsFeed();
      setFeed(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Haber akışı yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const loadSuggested = async () => {
    try {
      const data = await followService.getSuggestedUsers(5);
      setSuggested(data);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    }
  };

  const handleLike = async (newsId, currentlyLiked) => {
    try {
      if (currentlyLiked) {
        await newsService.unlikeNews(newsId);
      } else {
        await newsService.likeNews(newsId);
      }
      loadFeed();
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      yıl: 31536000,
      ay: 2592000,
      hafta: 604800,
      gün: 86400,
      saat: 3600,
      dakika: 60
    };

    for (const [name, count] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / count);
      if (interval >= 1) {
        return `${interval} ${name} önce`;
      }
    }
    return 'Az önce';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Haber Akışım
          </h1>
          <p className="text-gray-600 mt-2">Takip ettiğiniz yazarlardan haberler</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feed */}
          <div className="lg:col-span-2 space-y-6">
            {error && <ErrorMessage message={error} />}

            {feed.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz haber yok</h3>
                <p className="text-gray-600 mb-6">Haber akışınızda görmek için yazarları takip edin</p>
                <button
                  onClick={() => navigate('/explore')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Yazarları Keşfet
                </button>
              </div>
            ) : (
              feed.map((news) => (
                <article
                  key={news.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
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
                        <p className="font-semibold text-gray-900">{news.username}</p>
                        <p className="text-sm text-gray-500">{formatTimeAgo(news.created_at)}</p>
                      </div>
                    </Link>
                    {news.category && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {news.category}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer"
                        onClick={() => setSelectedNews(news)}>
                      {news.title}
                    </h2>
                    {news.image_url && (
                      <img
                        src={news.image_url}
                        alt={news.title}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                    <p className="text-gray-700 line-clamp-3 mb-4">
                      {news.content}
                    </p>
                    <button
                      onClick={() => setSelectedNews(news)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Devamını Oku →
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-gray-50 flex items-center justify-between border-t">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLike(news.id, news.user_has_liked)}
                        className={`flex items-center space-x-2 transition-colors ${
                          news.user_has_liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                        }`}
                      >
                        <svg className="w-6 h-6" fill={news.user_has_liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{news.like_count}</span>
                      </button>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{news.comment_count}</span>
                      </div>
                    </div>
                    <button className="text-gray-600 hover:text-gray-900">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Users */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Önerilen Yazarlar</h3>
              <div className="space-y-4">
                {suggested.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <Link to={`/user/${user.id}`} className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.news_count} haber</p>
                      </div>
                    </Link>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors">
                      Takip Et
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Kendi Haberini Yaz</h3>
              <p className="text-sm mb-4 opacity-90">
                Sende haberlerini yaz ve takipçilerinle paylaş!
              </p>
              <button
                onClick={() => navigate('/write')}
                className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Haber Yaz
              </button>
            </div>
          </div>
        </div>

        {/* News Detail Modal */}
        {selectedNews && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={() => setSelectedNews(null)}>
            <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Haber Detayı</h2>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-8">
                <ProtectedContent authorName={selectedNews.username}>
                  <div className="mb-4">
                    {selectedNews.category && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {selectedNews.category}
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedNews.title}</h1>
                  <div className="flex items-center space-x-4 mb-6 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {selectedNews.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{selectedNews.username}</span>
                    </div>
                    <span>•</span>
                    <span>{new Date(selectedNews.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  {selectedNews.image_url && (
                    <img
                      src={selectedNews.image_url}
                      alt={selectedNews.title}
                      className="w-full h-96 object-cover rounded-lg mb-6"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                  <div className="prose max-w-none text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                    {selectedNews.content}
                  </div>
                  {selectedNews.tags && selectedNews.tags.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex flex-wrap gap-2">
                        {selectedNews.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </ProtectedContent>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
