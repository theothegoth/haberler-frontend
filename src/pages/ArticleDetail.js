import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import newsService from '../services/newsService';
import bookmarkService from '../services/bookmarkService';
import commentService from '../services/commentService';
import ProtectedContent from '../components/ProtectedContent';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import HTMLContent from '../components/HTMLContent';
import blockService from '../services/blockService';
import ReportModal from '../components/ReportModal';
import SimilarArticles from '../components/SimilarArticles';
import ArticleImageGallery from '../components/ArticleImageGallery';
import ArticleVideoAttachment from '../components/ArticleVideoAttachment';
import EditedBadge from '../components/EditedBadge';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [likingComment, setLikingComment] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    loadArticle();
    loadComments();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const data = await newsService.getNewsById(id);
      setArticle(data);
      setIsLiked(data.user_has_liked || false);

      // Check if author is blocked
      if (currentUser && data.user_id !== currentUser.id) {
        try {
          const blockStatus = await blockService.checkIfBlocked(data.user_id);
          setIsBlocked(blockStatus.isBlocked);
        } catch (err) {
          console.error('Error checking block status:', err);
        }
      }

      // Check if article is bookmarked
      try {
        const saved = await bookmarkService.checkSaved(id);
        setIsSaved(saved);
      } catch (err) {
        console.error('Error checking bookmark status:', err);
      }

      setError(null);
    } catch (err) {
      console.error('Error loading article:', err);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await commentService.getComments(id);
      setComments(data);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      alert(t('common.loginRequired'));
      return;
    }

    try {
      if (isLiked) {
        await newsService.unlikeNews(id);
        setIsLiked(false);
        setArticle(prev => ({ ...prev, like_count: prev.like_count - 1 }));
      } else {
        await newsService.likeNews(id);
        setIsLiked(true);
        setArticle(prev => ({ ...prev, like_count: prev.like_count + 1 }));
      }
    } catch (err) {
      console.error('Error liking article:', err);
      alert(err.response?.data?.error || t('common.error'));
    }
  };

  const handleBlockToggle = async () => {
    if (!currentUser) {
      alert(t('common.loginRequired'));
      return;
    }

    const confirmMsg = isBlocked
      ? 'Bu kullanıcının engelini kaldırmak istediğinizden emin misiniz?'
      : 'Bu kullanıcıyı engellemek istediğinizden emin misiniz? Engellenmiş kullanıcıların içerikleri gizlenecektir.';

    if (!window.confirm(confirmMsg)) return;

    try {
      if (isBlocked) {
        await blockService.unblockUser(article.user_id);
        setIsBlocked(false);
        alert('Kullanıcının engeli kaldırıldı');
      } else {
        await blockService.blockUser(article.user_id);
        setIsBlocked(true);
        alert('Kullanıcı engellendi');
      }
    } catch (err) {
      console.error('Block toggle error:', err);
      alert(err.response?.data?.error || t('common.error'));
    }
  };

  const handleBookmark = async () => {
    if (!currentUser) {
      alert(t('common.loginRequired'));
      return;
    }

    try {
      if (isSaved) {
        await bookmarkService.unsaveArticle(article.id);
        setIsSaved(false);
      } else {
        await bookmarkService.saveArticle(article.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      alert(t('common.error'));
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert(t('common.loginRequired'));
      return;
    }

    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      await commentService.createComment(id, newComment);
      setNewComment('');
      await loadComments(); // Reload to get proper sorting
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert(err.response?.data?.error || t('common.error'));
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSubmitReply = async (parentId) => {
    if (!currentUser) {
      alert(t('common.loginRequired'));
      return;
    }

    if (!replyContent.trim()) return;

    try {
      await commentService.createComment(id, replyContent, parentId);
      setReplyContent('');
      setReplyingTo(null);
      await loadComments(); // Reload to get proper sorting and replies
    } catch (err) {
      console.error('Error submitting reply:', err);
      alert(err.response?.data?.error || t('common.error'));
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!currentUser) {
      alert(t('common.loginRequired'));
      return;
    }

    // Prevent double-clicking
    if (likingComment === commentId) return;

    setLikingComment(commentId);

    try {
      // Find comment in current state to determine action
      const findComment = (comments) => {
        for (const comment of comments) {
          if (comment.id === commentId) return comment;
          if (comment.replies) {
            const reply = comment.replies.find(r => r.id === commentId);
            if (reply) return reply;
          }
        }
        return null;
      };

      const currentComment = findComment(comments);
      if (!currentComment) {
        setLikingComment(null);
        return;
      }

      const wasLiked = currentComment.user_has_liked;

      // Optimistically update UI
      setComments(prevComments => {
        const updateComment = (c) => {
          if (c.id === commentId) {
            return {
              ...c,
              user_has_liked: !wasLiked,
              like_count: wasLiked ? c.like_count - 1 : c.like_count + 1
            };
          }
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map(r => updateComment(r))
            };
          }
          return c;
        };
        return prevComments.map(c => updateComment(c));
      });

      // Make API call based on current state
      if (wasLiked) {
        await commentService.unlikeComment(commentId);
      } else {
        await commentService.likeComment(commentId);
      }

    } catch (err) {
      console.error('Error toggling comment like:', err);
      alert(err.response?.data?.error || t('common.error'));
      // Reload comments on error to restore correct state
      await loadComments();
    } finally {
      setLikingComment(null);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm(t('common.confirmDelete'))) return;

    try {
      await commentService.deleteComment(commentId);
      await loadComments(); // Reload comments
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert(err.response?.data?.error || t('common.error'));
    }
  };

  const renderComment = (comment, isReply = false) => (
    <div
      key={comment.id}
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm ${isReply ? 'ml-12' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <Link to={`/user/${comment.user_id}`}>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {(comment.username || 'U').charAt(0).toUpperCase()}
            </div>
          </Link>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Link
                to={`/user/${comment.user_id}`}
                className="font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400"
              >
                {comment.username}
              </Link>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(comment.created_at).toLocaleDateString('tr-TR')}
              </span>
            </div>
            <p className="mt-1 text-gray-700 dark:text-gray-300">
              {comment.content}
            </p>

            {/* Comment Actions */}
            <div className="mt-2 flex items-center space-x-4">
              {/* Like Button */}
              <button
                onClick={() => handleLikeComment(comment.id)}
                className={`flex items-center space-x-1 text-sm ${
                  comment.user_has_liked
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                } transition-colors`}
              >
                <svg
                  className="w-4 h-4"
                  fill={comment.user_has_liked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  />
                </svg>
                <span>{comment.like_count || 0}</span>
              </button>

              {/* Reply Button (only for top-level comments) */}
              {!isReply && currentUser && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {t('articleDetail.reply')}
                </button>
              )}
            </div>

            {/* Reply Form */}
            {!isReply && replyingTo === comment.id && (
              <div className="mt-3">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={t('articleDetail.writeReply')}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none text-sm"
                  rows="2"
                />
                <div className="mt-2 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                    className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyContent.trim()}
                    className="px-4 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('articleDetail.submitReply')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {currentUser && currentUser.id === comment.user_id && (
          <button
            onClick={() => handleDeleteComment(comment.id)}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('common.error')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || t('articleDetail.notFound')}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {t('common.goBack')}
          </button>
        </div>
      </div>
    );
  }

  const isOwnArticle = currentUser && currentUser.id === article.user_id;

  // Calculate total comment count (including replies)
  const totalCommentCount = comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);

  return (
    <>
      <SEO
        title={article.title}
        description={article.content?.substring(0, 160)}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{t('common.goBack')}</span>
          </button>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Article Column */}
            <div className="lg:col-span-2">
              {/* Article Container */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <ProtectedContent authorName={article.username}>
                {/* Category */}
                {article.category && (
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm">
                      {article.category}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {article.title}
                </h1>

                {/* Author and Meta Info */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <Link
                      to={`/user/${article.user_id}`}
                      className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {(article.username || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {article.username}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(article.created_at).toLocaleDateString('tr-TR')}
                          </p>
                          <EditedBadge
                            createdAt={article.created_at}
                            updatedAt={article.updated_at}
                            size="sm"
                          />
                        </div>
                      </div>
                    </Link>

                  {/* Block and Report Buttons */}
                  {currentUser && !isOwnArticle && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleBlockToggle}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          isBlocked
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                        }`}
                        title={isBlocked ? 'Engeli Kaldır' : 'Kullanıcıyı Engelle'}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        <span>{isBlocked ? 'Engeli Kaldır' : 'Engelle'}</span>
                      </button>

                      <button
                        onClick={() => setShowReportModal(true)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm
                                 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300
                                 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="İçeriği Bildir"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                        <span>Bildir</span>
                      </button>
                    </div>
                  )}
                </div>

                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isLiked
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={isLiked ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      />
                    </svg>
                    <span className="font-semibold">{article.like_count || 0}</span>
                  </button>

                  {/* View Count */}
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{article.view_count || 0}</span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={handleBookmark}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isSaved
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/40'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title={isSaved ? t('bookmark.unsaveArticle') : t('bookmark.saveArticle')}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={isSaved ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    <span className="font-semibold">{isSaved ? t('bookmark.unsave') : t('bookmark.save')}</span>
                  </button>
                </div>

                {/* Article Image Gallery */}
                <div className="mb-6">
                  <ArticleImageGallery articleId={id} editable={false} />
                </div>

                {/* Article Video */}
                <div className="mb-6">
                  <ArticleVideoAttachment articleId={id} editable={false} />
                </div>

                {/* Article Content */}
                <HTMLContent
                  content={article.content}
                  className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8"
                />

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="pt-6 border-t dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Edit/Delete Buttons for Own Articles */}
                {isOwnArticle && (
                  <div className="mt-6 pt-6 border-t dark:border-gray-700 flex items-center space-x-4">
                    <Link
                      to={`/edit-article/${article.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {t('common.edit')}
                    </Link>
                  </div>
                )}
              </ProtectedContent>
            </div>

            {/* Comments Section */}
            <div className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t('articleDetail.comments')} ({totalCommentCount})
              </h2>

              {/* Comment Form */}
              {currentUser ? (
                <form onSubmit={handleSubmitComment} className="mb-8">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t('articleDetail.writeComment')}
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                    rows="3"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingComment ? t('common.submitting') : t('articleDetail.submitComment')}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200">
                    {t('articleDetail.loginToComment')}
                  </p>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    {t('articleDetail.noComments')}
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id}>
                      {renderComment(comment, false)}
                      {/* Render replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {comment.replies.map(reply => renderComment(reply, true))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
              </div>
            </div>

            {/* Sidebar Column - Similar Articles */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {article && <SimilarArticles newsId={article.id} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        contentType="article"
        contentId={article?.id}
        contentTitle={article?.title}
      />
    </>
  );
};

export default ArticleDetail;
