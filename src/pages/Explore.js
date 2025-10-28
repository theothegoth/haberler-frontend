import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import followService from '../services/followService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Explore = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [followingUsers, setFollowingUsers] = useState(new Set());
  const [followLoading, setFollowLoading] = useState(new Set());

  useEffect(() => {
    loadUsers();
    loadMyFollowing();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await followService.getSuggestedUsers(100);
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.error || t('explore.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const loadMyFollowing = async () => {
    try {
      const data = await followService.getMyFollowing();
      const followingIds = new Set(data.map(u => u.id));
      setFollowingUsers(followingIds);
    } catch (err) {
      console.error('Failed to load following:', err);
    }
  };

  const handleFollow = async (userId) => {
    if (followLoading.has(userId)) return;

    try {
      setFollowLoading(new Set([...followLoading, userId]));

      if (followingUsers.has(userId)) {
        await followService.unfollowUser(userId);
        setFollowingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      } else {
        await followService.followUser(userId);
        setFollowingUsers(prev => new Set([...prev, userId]));
      }
    } catch (err) {
      console.error('Follow error:', err);
    } finally {
      setFollowLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            {t('explore.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t('explore.subtitle')}</p>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Users Grid */}
        {users.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('explore.noUsers')}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('explore.noUsersMessage')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  {/* Avatar and Name */}
                  <Link to={`/user/${user.id}`} className="block mb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center hover:text-green-600 transition-colors">
                      {user.username}
                    </h3>
                  </Link>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.news_count || 0}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('explore.articles')}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.followers_count || 0}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('explore.followers')}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.following_count || 0}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('explore.following')}</p>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <button
                    onClick={() => handleFollow(user.id)}
                    disabled={followLoading.has(user.id)}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                      followingUsers.has(user.id)
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        : 'bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {followLoading.has(user.id) ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('explore.loading')}
                      </span>
                    ) : followingUsers.has(user.id) ? (
                      t('explore.following')
                    ) : (
                      t('explore.follow')
                    )}
                  </button>

                  {/* View Profile Button */}
                  <Link
                    to={`/user/${user.id}`}
                    className="block w-full mt-2 py-2 px-4 text-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t('explore.viewProfile')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl shadow-lg p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">{users.length}</p>
              <p className="text-lg opacity-90">{t('explore.totalAuthors')}</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">{followingUsers.size}</p>
              <p className="text-lg opacity-90">{t('explore.youAreFollowing')}</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">{users.reduce((sum, u) => sum + (u.news_count || 0), 0)}</p>
              <p className="text-lg opacity-90">{t('explore.totalArticles')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
