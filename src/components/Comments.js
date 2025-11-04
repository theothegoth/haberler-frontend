import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import commentService from '../services/commentService';

const Comments = ({ newsId, onCommentCountChange }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await commentService.getComments(newsId);
      setComments(data);
      onCommentCountChange?.(data.length);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  }, [newsId, onCommentCountChange]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await commentService.createComment(newsId, newComment);
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Failed to create comment:', error);
      alert(error.response?.data?.error || t('comments.createError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm(t('comments.confirmDelete'))) return;

    try {
      await commentService.deleteComment(commentId);
      loadComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert(error.response?.data?.error || t('comments.deleteError'));
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

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {t('comments.title')} ({comments.length})
      </h3>

      {/* Comment Form */}
      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t('comments.placeholder')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                rows="3"
                maxLength="500"
                disabled={submitting}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {newComment.length}/500
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? t('comments.posting') : t('comments.post')}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            {t('comments.noComments')}
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {comment.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {comment.username}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(comment.created_at)}
                    </span>
                    {user && user.userId === comment.user_id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        {t('comments.delete')}
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-200 text-sm whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
