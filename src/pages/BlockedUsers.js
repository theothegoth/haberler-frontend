import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import blockService from '../services/blockService';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';

const BlockedUsers = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await blockService.getBlockedUsers();
      setBlockedUsers(data);
    } catch (err) {
      console.error('Error loading blocked users:', err);
      setError(err.response?.data?.error || 'Engellenen kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId, username) => {
    if (!window.confirm(`${username} kullanıcısının engelini kaldırmak istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await blockService.unblockUser(userId);
      alert('Kullanıcının engeli kaldırıldı');
      await loadBlockedUsers();
    } catch (err) {
      console.error('Error unblocking user:', err);
      alert(err.response?.data?.error || 'Engel kaldırılırken bir hata oluştu');
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
      <SEO title="Engellenmiş Kullanıcılar" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Engellenmiş Kullanıcılar
              </h1>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {blockedUsers.length} kullanıcı
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {blockedUsers.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-20 h-20 mx-auto text-gray-400 dark:text-gray-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">
                  Henüz hiç kullanıcı engellemediniz
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  Engellemek istediğiniz kullanıcıların profillerinden veya içeriklerinden engelleme yapabilirsiniz
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {blockedUsers.map((blocked) => (
                  <div
                    key={blocked.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Link
                      to={`/user/${blocked.blocked_id}`}
                      className="flex items-center space-x-3 flex-1 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {(blocked.username || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {blocked.username}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Engellenme tarihi: {new Date(blocked.created_at).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </Link>

                    <button
                      onClick={() => handleUnblock(blocked.blocked_id, blocked.username)}
                      className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Engeli Kaldır</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                    Engelleme hakkında
                  </p>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                    <li>Engellediğiniz kullanıcıların içerikleri haber akışınızda görünmez</li>
                    <li>Engellediğiniz kullanıcıların yorumları gizlenir</li>
                    <li>Engelleme işlemi gizlidir, karşı taraf haberdar olmaz</li>
                    <li>İstediğiniz zaman engeli kaldırabilirsiniz</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockedUsers;
