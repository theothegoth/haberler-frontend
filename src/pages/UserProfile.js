import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import newsService from '../services/newsService';
import followService from '../services/followService';
import blockService from '../services/blockService';
import ProtectedContent from '../components/ProtectedContent';
import LoadingSpinner from '../components/LoadingSpinner';
import ReportModal from '../components/ReportModal';
import EditedBadge from '../components/EditedBadge';
import DOMPurify from 'dompurify';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [counts, setCounts] = useState({ followers_count: 0, following_count: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [profileUser, setProfileUser] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 12;
  const [likedArticles, setLikedArticles] = useState(new Set());
  const [isBlocked, setIsBlocked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Helper to strip HTML tags for preview
  const stripHTML = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = DOMPurify.sanitize(html);
    return tmp.textContent || tmp.innerText || '';
  };

  const loadProfile = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setOffset(0);
      } else {
        setLoadingMore(true);
      }

      const currentOffset = reset ? 0 : offset;
      const promises = [
        newsService.getUserNews(userId, LIMIT, currentOffset),
        followService.getFollowCounts(userId),
        currentUser ? followService.checkFollowing(userId) : Promise.resolve({ isFollowing: false })
      ];

      // Check block status if not own profile
      if (currentUser && currentUser.id !== parseInt(userId)) {
        promises.push(blockService.checkIfBlocked(userId));
      }

      const results = await Promise.all(promises);
      const [newsData, countsData, followingData, blockData] = results;

      if (reset) {
        setArticles(newsData);
      } else {
        setArticles(prev => [...prev, ...newsData]);
      }

      setCounts(countsData);
      setIsFollowing(followingData.isFollowing);
      if (blockData) {
        setIsBlocked(blockData.isBlocked);
      }
      setHasMore(newsData.length === LIMIT);

      if (!reset) {
        setOffset(prev => prev + LIMIT);
      } else {
        setOffset(LIMIT);
      }

      // Fetch user profile data separately
      if (reset) {
        try {
          const response = await apiClient.get(`/auth/user/${userId}`);
          setProfileUser({
            username: response.data.user.username,
            user_bio: response.data.user.bio,
            user_profile_picture: response.data.user.profile_picture
          });
        } catch (err) {
          console.error('Error fetching user profile:', err);
          // Fallback to article data if available
          if (newsData.length > 0) {
            setProfileUser({
              username: newsData[0].username,
              user_bio: newsData[0].user_bio,
              user_profile_picture: newsData[0].user_profile_picture
            });
          }
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [userId, currentUser, offset]);

  useEffect(() => {
    loadProfile(true);
  }, [userId, currentUser]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await followService.unfollowUser(userId);
      } else {
        await followService.followUser(userId);
      }
      setIsFollowing(!isFollowing);
      loadProfile(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Bir hata oluştu');
    }
  };

  const handleBlockToggle = async () => {
    if (!currentUser) {
      alert('Bu işlem için giriş yapmanız gerekiyor');
      return;
    }

    const confirmMsg = isBlocked
      ? 'Bu kullanıcının engelini kaldırmak istediğinizden emin misiniz?'
      : 'Bu kullanıcıyı engellemek istediğinizden emin misiniz? Engellediğinizde bu kullanıcının içeriklerini göremeyeceksiniz.';

    if (!window.confirm(confirmMsg)) return;

    try {
      if (isBlocked) {
        await blockService.unblockUser(userId);
        setIsBlocked(false);
        alert('Kullanıcının engeli kaldırıldı');
      } else {
        await blockService.blockUser(userId);
        setIsBlocked(true);
        alert('Kullanıcı engellendi. Artık bu kullanıcının içeriklerini göremeyeceksiniz.');
        // Redirect to home after blocking
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      console.error('Block toggle error:', err);
      alert(err.response?.data?.error || 'Bir hata oluştu');
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadProfile(false);
    }
  };

  const handleLike = async (articleId, e) => {
    if (e) {
      e.stopPropagation();
    }

    if (!currentUser) {
      alert(t('common.loginRequired'));
      return;
    }

    const isLiked = likedArticles.has(articleId);

    try {
      if (isLiked) {
        await newsService.unlikeNews(articleId);
        setLikedArticles(prev => {
          const newSet = new Set(prev);
          newSet.delete(articleId);
          return newSet;
        });
      } else {
        await newsService.likeNews(articleId);
        setLikedArticles(prev => new Set(prev).add(articleId));
      }

      // Update like count in articles
      setArticles(prev => prev.map(article =>
        article.id === articleId
          ? { ...article, like_count: article.like_count + (isLiked ? -1 : 1) }
          : article
      ));

    } catch (err) {
      console.error('Error liking article:', err);
      alert(err.response?.data?.error || t('common.error'));
    }
  };

  if (loading) return <LoadingSpinner />;

  const isOwnProfile = currentUser && currentUser.id === parseInt(userId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {profileUser?.user_profile_picture ? (
                <img
                  src={`http://localhost:5000${profileUser.user_profile_picture}`}
                  alt={profileUser?.username}
                  className="w-24 h-24 rounded-full object-cover bg-white bg-opacity-20 shrink-0"
                  onError={(e) => {
                    console.error('Failed to load profile picture:', profileUser.user_profile_picture);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-5xl font-bold backdrop-blur-sm shrink-0 ${profileUser?.user_profile_picture ? 'hidden' : ''}`}>
                <span className="select-none">{(profileUser?.username || 'U').charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{profileUser?.username || 'Kullanıcı'}</h1>
                {/* Bio */}
                {profileUser?.user_bio && (
                  <p className="text-sm mt-2 mb-2 max-w-md text-white text-opacity-90">
                    {profileUser.user_bio}
                  </p>
                )}
                <div className="flex items-center space-x-6 text-sm">
                  <div>
                    <span className="font-semibold">{articles.length}</span> {t('userProfile.articles')}
                  </div>
                  <div>
                    <span className="font-semibold">{counts.followers_count}</span> {t('userProfile.followers')}
                  </div>
                  <div>
                    <span className="font-semibold">{counts.following_count}</span> {t('userProfile.following')}
                  </div>
                </div>
              </div>
            </div>
            {!isOwnProfile && currentUser && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleFollowToggle}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                    isFollowing
                      ? 'bg-white bg-opacity-20 hover:bg-opacity-30'
                      : 'bg-white text-purple-600 hover:bg-gray-100'
                  }`}
                >
                  {isFollowing ? t('userProfile.unfollow') : t('userProfile.follow')}
                </button>

                <button
                  onClick={handleBlockToggle}
                  className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
                  title={isBlocked ? 'Engeli Kaldır' : 'Engelle'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </button>

                <button
                  onClick={() => setShowReportModal(true)}
                  className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
                  title="Bildir"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('userProfile.articles')}</h2>

        {articles.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('userProfile.noArticles')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('userProfile.noArticlesMessage')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link to={`/article/${article.id}`} key={article.id}>
                <article
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                >
                {article.image_url && (
                  <img
                    src={getImageUrl(article.image_url)}
                    alt={article.title}
                    className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-700"
                    onError={handleImageError}
                  />
                )}
                <div className="p-6">
                  {article.category && (
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                      {article.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-3 mb-2 line-clamp-2 break-words">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 break-words">
                    {stripHTML(article.content)}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span>{new Date(article.created_at).toLocaleDateString('tr-TR')}</span>
                      <EditedBadge
                        createdAt={article.created_at}
                        updatedAt={article.updated_at}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => handleLike(article.id, e)}
                        className={`flex items-center space-x-1 transition-colors ${likedArticles.has(article.id) ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'}`}
                      >
                        <svg className="w-4 h-4" fill={likedArticles.has(article.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 20 20">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                        <span>{article.like_count || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
              </Link>
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
              {loadingMore ? t('userProfile.loading') : t('userProfile.loadMore')}
            </button>
          </div>
        )}
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        contentType="user"
        contentId={userId}
        contentTitle={profileUser?.username || 'Kullanıcı'}
      />
    </div>
  );
};

export default UserProfile;
