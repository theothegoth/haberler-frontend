import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import articleVideoService from '../services/articleVideoService';

const ArticleVideoAttachment = ({ articleId, editable = false, userVideos = [], onVideoChange }) => {
  const { t } = useTranslation();
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (articleId) {
      loadVideos();
    }
  }, [articleId]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const fetchedVideos = await articleVideoService.getVideos(articleId);
      setVideos(fetchedVideos);
      setError(null);
    } catch (err) {
      console.error('Error loading videos:', err);
      setError(t('videoAttachment.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  // Extract video ID from YouTube URL
  const extractVideoId = (input) => {
    if (!input) return null;

    // Already a video ID (11 characters)
    if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) {
      return input.trim();
    }

    // Various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) return match[1];
    }

    return null;
  };

  const handleAddVideo = async () => {
    let videoIdToAdd = null;

    // Priority: URL input first, then dropdown selection
    if (videoUrl.trim()) {
      videoIdToAdd = extractVideoId(videoUrl);
      if (!videoIdToAdd) {
        setError(t('videoAttachment.invalidUrl'));
        return;
      }
    } else if (selectedVideoId) {
      videoIdToAdd = selectedVideoId;
    } else {
      alert(t('videoAttachment.selectVideoFirst'));
      return;
    }

    try {
      setLoading(true);
      await articleVideoService.addVideo(articleId, videoIdToAdd);
      setSelectedVideoId('');
      setVideoUrl('');
      await loadVideos();
      setError(null);
      // Notify parent component that videos changed
      if (onVideoChange) {
        onVideoChange();
      }
    } catch (err) {
      console.error('Error adding video:', err);
      setError(err.response?.data?.error || t('videoAttachment.errorAdding'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm(t('videoAttachment.confirmDelete'))) {
      return;
    }

    try {
      setLoading(true);
      await articleVideoService.deleteVideo(videoId);
      await loadVideos();
      setError(null);
      // Notify parent component that videos changed
      if (onVideoChange) {
        onVideoChange();
      }
    } catch (err) {
      console.error('Error deleting video:', err);
      setError(t('videoAttachment.errorDeleting'));
    } finally {
      setLoading(false);
    }
  };

  if (!editable && videos.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {editable ? t('videoAttachment.addVideo') : t('videoAttachment.relatedVideo')}
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Add Video Section (only in edit mode) */}
      {editable && videos.length === 0 && (
        <div className="mb-6 space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('videoAttachment.addFromUrl')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder={t('videoAttachment.urlPlaceholder')}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                disabled={loading}
              />
              <button
                onClick={handleAddVideo}
                disabled={loading || !videoUrl.trim()}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? t('videoAttachment.adding') : t('videoAttachment.add')}
              </button>
            </div>
          </div>

          {/* Divider */}
          {userVideos && userVideos.length > 0 && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  {t('videoAttachment.orSelectFromYours')}
                </span>
              </div>
            </div>
          )}

          {/* Dropdown for user's videos */}
          {userVideos && userVideos.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('videoAttachment.selectFromMyVideos')}
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedVideoId}
                  onChange={(e) => setSelectedVideoId(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                >
                  <option value="">{t('videoAttachment.selectVideo')}</option>
                  {userVideos.map((video) => (
                    <option key={video.video_id} value={video.video_id}>
                      {video.title}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddVideo}
                  disabled={loading || !selectedVideoId}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? t('videoAttachment.adding') : t('videoAttachment.add')}
                </button>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('videoAttachment.description')}
          </p>
        </div>
      )}

      {/* Video Display */}
      {videos.length > 0 && (
        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Video Thumbnail and Info */}
              <div className="flex gap-4 p-4">
                <div className="relative flex-shrink-0 w-40 h-24 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
                    {video.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {video.channel_title}
                  </p>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                  >
                    {t('videoAttachment.watchOnYoutube')}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                {editable && (
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    disabled={loading}
                    className="flex-shrink-0 px-3 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                    title={t('videoAttachment.removeVideo')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Embedded Video Player */}
              <div className="relative pb-[56.25%] bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${video.video_id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {editable && videos.length > 0 && (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {t('videoAttachment.videoLimitMessage')}
        </p>
      )}
    </div>
  );
};

export default ArticleVideoAttachment;
