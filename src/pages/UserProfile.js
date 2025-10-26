import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import newsService from '../services/newsService';
import followService from '../services/followService';
import ProtectedContent from '../components/ProtectedContent';
import LoadingSpinner from '../components/LoadingSpinner';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const [counts, setCounts] = useState({ followers_count: 0, following_count: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [newsData, countsData, followingData] = await Promise.all([
        newsService.getUserNews(userId),
        followService.getFollowCounts(userId),
        currentUser ? followService.checkFollowing(userId) : Promise.resolve({ isFollowing: false })
      ]);

      setArticles(newsData);
      setCounts(countsData);
      setIsFollowing(followingData.isFollowing);

      if (newsData.length > 0) {
        setProfileUser({ username: newsData[0].username });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await followService.unfollowUser(userId);
      } else {
        await followService.followUser(userId);
      }
      setIsFollowing(!isFollowing);
      loadProfile();
    } catch (err) {
      alert(err.response?.data?.error || 'Bir hata oluştu');
    }
  };

  if (loading) return <LoadingSpinner />;

  const isOwnProfile = currentUser && currentUser.id === parseInt(userId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl font-bold backdrop-blur-sm">
                {(profileUser?.username || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{profileUser?.username || 'Kullanıcı'}</h1>
                <div className="flex items-center space-x-6 text-sm">
                  <div>
                    <span className="font-semibold">{articles.length}</span> Haber
                  </div>
                  <div>
                    <span className="font-semibold">{counts.followers_count}</span> Takipçi
                  </div>
                  <div>
                    <span className="font-semibold">{counts.following_count}</span> Takip
                  </div>
                </div>
              </div>
            </div>
            {!isOwnProfile && currentUser && (
              <button
                onClick={handleFollowToggle}
                className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  isFollowing
                    ? 'bg-white bg-opacity-20 hover:bg-opacity-30'
                    : 'bg-white text-purple-600 hover:bg-gray-100'
                }`}
              >
                {isFollowing ? 'Takipten Çık' : 'Takip Et'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Haberler</h2>

        {articles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz haber yok</h3>
            <p className="text-gray-600">Bu kullanıcı henüz haber yazmamış</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedNews(article)}
              >
                {article.image_url && (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                <div className="p-6">
                  {article.category && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {article.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {article.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(article.created_at).toLocaleDateString('tr-TR')}</span>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span>{article.like_count}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
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
              <ProtectedContent authorName={profileUser?.username}>
                <div className="mb-4">
                  {selectedNews.category && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {selectedNews.category}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedNews.title}</h1>
                <div className="flex items-center space-x-4 mb-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {(profileUser?.username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{profileUser?.username}</span>
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
  );
};

export default UserProfile;
