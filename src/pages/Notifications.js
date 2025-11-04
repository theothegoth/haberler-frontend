import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import notificationService from '../services/notificationService';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';

const Notifications = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 20;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const currentOffset = isLoadMore ? offset : 0;
      const data = await notificationService.getNotifications(limit, currentOffset);

      if (isLoadMore) {
        setNotifications([...notifications, ...(data.notifications || [])]);
      } else {
        setNotifications(data.notifications || []);
      }

      setHasMore(data.hasMore || false);
      setOffset(currentOffset + limit);
      setError(null);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(t('common.error'));
      setNotifications([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      // Dispatch custom event to notify NotificationBell component
      window.dispatchEvent(new CustomEvent('notificationsMarkedAsRead'));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationLink = (notification) => {
    // For article-related notifications (like, comment, new_article), go to the article
    if (notification.entity_type === 'news' && notification.entity_id) {
      return `/article/${notification.entity_id}`;
    } else if (notification.type === 'follow') {
      return `/user/${notification.actor_id}`;
    }
    return '/notifications';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return t('notifications.justNow');
    if (diffInMins < 60) return t('notifications.minutesAgo', { count: diffInMins });
    if (diffInHours < 24) return t('notifications.hoursAgo', { count: diffInHours });
    if (diffInDays < 7) return t('notifications.daysAgo', { count: diffInDays });
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

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
        title={t('notifications.title')}
        description="View all your notifications"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t('notifications.title')}
                </h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {unreadCount} {unreadCount === 1 ? 'unread notification' : 'unread notifications'}
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  {t('notifications.markAllRead')}
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                {t('notifications.noNotifications')}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t('notifications.noNotificationsMessage')}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {notification.type === 'like' && (
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {notification.type === 'comment' && (
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {notification.type === 'follow' && (
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                          </svg>
                        </div>
                      )}
                      {notification.type === 'new_article' && (
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={getNotificationLink(notification)}
                        onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                        className="block group"
                      >
                        <p className="text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatTime(notification.created_at)}
                        </p>
                      </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && notifications.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => fetchNotifications(true)}
                disabled={loadingMore}
                className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? t('newsFeed.loading') : t('newsFeed.loadMore')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
