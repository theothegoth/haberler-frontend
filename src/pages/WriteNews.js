import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigationBlocker } from '../context/NavigationBlockerContext';
import draftService from '../services/draftService';
import ErrorMessage from '../components/ErrorMessage';
import SEO from '../components/SEO';
import RichTextEditor from '../components/RichTextEditor';
import ArticleImageGallery from '../components/ArticleImageGallery';
import ArticleVideoAttachment from '../components/ArticleVideoAttachment';
import ContentQualityIndicator from '../components/ContentQualityIndicator';
import ArticleTypeSelector from '../components/ArticleTypeSelector';
import useUserVideos from '../hooks/useUserVideos';
import articleImageService from '../services/articleImageService';
import articleVideoService from '../services/articleVideoService';

const WriteNews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { enableBlocker, disableBlocker } = useNavigationBlocker();
  const { videos: userVideos } = useUserVideos();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    articleType: 'news'
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [draftStatus, setDraftStatus] = useState(''); // 'saving', 'saved', 'error'
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [imageCount, setImageCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);
  const autoSaveTimer = useRef(null);
  const initialFormData = useRef(null);

  const categories = [
    'politics', 'economy', 'sports', 'technology', 'health',
    'education', 'culture', 'art', 'science', 'world', 'other'
  ];

  // Load draft on mount (if draftId is provided in URL)
  useEffect(() => {
    const loadDraft = async () => {
      const draftId = searchParams.get('draftId');

      if (draftId) {
        try {
          const draft = await draftService.getDraft(draftId);
          if (draft) {
            const loadedData = {
              title: draft.title || '',
              content: draft.content || '',
              category: draft.category || '',
              tags: draft.tags || [],
              articleType: draft.article_type || 'news'
            };
            setFormData(loadedData);
            setCurrentDraftId(parseInt(draftId));
            // Store initial data to compare for changes
            initialFormData.current = JSON.stringify(loadedData);
          }
        } catch (err) {
          console.error('Error loading draft:', err);
          setError('Failed to load draft');
        }
      } else {
        // No draft ID, creating new article
        initialFormData.current = JSON.stringify(formData);
      }
    };

    loadDraft();
  }, [searchParams]);

  // Auto-save draft
  const saveDraft = useCallback(async () => {
    // Only save if there's content
    if (!formData.title && !formData.content) {
      return;
    }

    try {
      setDraftStatus('saving');
      const draftData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        articleType: formData.articleType
      };

      let result;
      if (currentDraftId) {
        // Update existing draft
        result = await draftService.updateDraft(currentDraftId, draftData);
      } else {
        // Create new draft
        result = await draftService.createDraft(draftData);
        // Set the draft ID after creation and update URL
        if (result.draft && result.draft.id) {
          setCurrentDraftId(result.draft.id);
          // Update URL to include draftId
          navigate(`/write?draftId=${result.draft.id}`, { replace: true });
        }
      }

      setDraftStatus('saved');
      // Update initial data after successful save
      initialFormData.current = JSON.stringify(formData);
      setHasUnsavedChanges(false);
      setTimeout(() => setDraftStatus(''), 2000);
    } catch (err) {
      console.error('Error saving draft:', err);
      if (err.response?.data?.error?.includes('Maximum')) {
        setDraftStatus('max_reached');
      } else {
        setDraftStatus('error');
      }
      setTimeout(() => setDraftStatus(''), 3000);
    }
  }, [formData, currentDraftId, navigate]);

  // Track unsaved changes
  useEffect(() => {
    if (initialFormData.current) {
      const currentData = JSON.stringify(formData);
      const hasChanges = currentData !== initialFormData.current;
      setHasUnsavedChanges(hasChanges);
    }
  }, [formData]);

  // Auto-save effect
  useEffect(() => {
    // Clear existing timer
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    // Set new timer to auto-save after 30 seconds of no changes
    autoSaveTimer.current = setTimeout(() => {
      saveDraft();
    }, 30000);

    // Cleanup
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [formData, saveDraft]);

  // Enable/disable navigation blocker based on unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges && (formData.title || formData.content)) {
      enableBlocker(t('writeNews.unsavedChanges.message'));
    } else {
      disableBlocker();
    }

    return () => {
      disableBlocker();
    };
  }, [hasUnsavedChanges, formData.title, formData.content, enableBlocker, disableBlocker, t]);

  // Warn user before leaving page with unsaved changes (browser navigation)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges && (formData.title || formData.content)) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
        return ''; // Some browsers show this message
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, formData.title, formData.content]);

  // Function to fetch media counts
  const fetchMediaCounts = useCallback(async () => {
    if (!currentDraftId) {
      setImageCount(0);
      setVideoCount(0);
      return;
    }

    try {
      const [images, videos] = await Promise.all([
        articleImageService.getImages(currentDraftId),
        articleVideoService.getVideos(currentDraftId)
      ]);
      setImageCount(images?.length || 0);
      setVideoCount(videos?.length || 0);
    } catch (err) {
      console.error('Error fetching media counts:', err);
      // Don't set error state, just keep counts at 0
    }
  }, [currentDraftId]);

  // Fetch media counts when draft ID changes
  useEffect(() => {
    fetchMediaCounts();
  }, [fetchMediaCounts]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleNewArticle = () => {
    if (hasUnsavedChanges && (formData.title || formData.content)) {
      if (!window.confirm(t('writeNews.confirmNewArticle'))) {
        return;
      }
    }

    const emptyData = {
      title: '',
      content: '',
      category: '',
      tags: [],
      articleType: 'news'
    };
    setFormData(emptyData);
    setCurrentDraftId(null);
    setHasUnsavedChanges(false);
    setDraftStatus('');
    setError('');
    setSuccess('');
    setPreview(false); // Exit preview mode
    initialFormData.current = JSON.stringify(emptyData);
    // Navigate back to write page without draft ID
    navigate('/write', { replace: true });
  };

  const handleDiscardDraft = async () => {
    if (!currentDraftId) return;

    if (window.confirm(t('writeNews.confirmDiscardDraft'))) {
      try {
        await draftService.deleteDraft(currentDraftId);
        const emptyData = {
          title: '',
          content: '',
          category: '',
          tags: [],
          articleType: 'news'
        };
        setFormData(emptyData);
        setCurrentDraftId(null);
        setHasUnsavedChanges(false);
        initialFormData.current = JSON.stringify(emptyData);
        // Navigate back to write page without draft ID
        navigate('/write', { replace: true });
        setSuccess(t('writeNews.draftDiscarded'));
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(t('writeNews.draftDiscardError'));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check media requirement on frontend first
    if (imageCount === 0 && videoCount === 0) {
      setError('VALIDATION.MEDIA_REQUIRED');
      return;
    }

    try {
      setLoading(true);

      let draftIdToPublish = currentDraftId;

      // If no draft exists, create one first so media validation can work
      if (!draftIdToPublish) {
        const draft = await draftService.createDraft(formData);
        draftIdToPublish = draft.id;
      } else {
        // Save current content to draft before publishing
        await draftService.updateDraft(draftIdToPublish, formData);
      }

      // Now publish the draft (which will check for media)
      await draftService.publishDraft(draftIdToPublish);

      // Clear unsaved changes flag to allow navigation without warning
      setHasUnsavedChanges(false);

      setSuccess(t('writeNews.success'));
      setTimeout(() => {
        navigate('/my-articles');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'writeNews.error';
      // Store the error KEY, not the translated text, so it can be re-translated when language changes
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Write News"
        description="Write and publish your own news articles. Share your stories with the world on Gaste news platform."
        keywords="write news, publish article, create news, journalism, write story, news writer"
        url="https://gaste.com/write"
        noindex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t('writeNews.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">{t('writeNews.subtitle')}</p>
                {/* Draft Status */}
                {draftStatus === 'saving' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('writeNews.draft.saving')}</p>
                )}
                {draftStatus === 'saved' && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">{t('writeNews.draft.saved')}</p>
                )}
                {draftStatus === 'error' && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{t('writeNews.draft.error')}</p>
                )}
                {draftStatus === 'max_reached' && (
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">{t('writeNews.draft.maxReached')}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {currentDraftId && (
                <button
                  onClick={handleNewArticle}
                  className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>{t('writeNews.buttons.newArticle')}</span>
                </button>
              )}
              {hasUnsavedChanges && (formData.title || formData.content) && (
                <button
                  onClick={saveDraft}
                  disabled={draftStatus === 'saving'}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                  </svg>
                  <span>{t('writeNews.buttons.saveDraft')}</span>
                </button>
              )}
              {currentDraftId && (
                <button
                  onClick={handleDiscardDraft}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg transition-colors"
                >
                  {t('writeNews.buttons.discardDraft')}
                </button>
              )}
              <button
                onClick={() => setPreview(!preview)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg dark:text-white transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span>{preview ? t('writeNews.buttons.edit') : t('writeNews.buttons.preview')}</span>
              </button>
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={t(error)} />}
        {success && (
          <div className="bg-green-50 dark:bg-green-900 dark:bg-opacity-20 border-l-4 border-green-500 p-4 mb-6 rounded">
            <p className="text-green-700 dark:text-green-300">{success}</p>
          </div>
        )}

        {!preview ? (
          /* Editor Form */
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Title */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                {t('writeNews.form.title')} *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={t('writeNews.form.titlePlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                required
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{formData.title.length} / {t('writeNews.form.minCharacters')} 20 {t('writeNews.form.titleHelper')}</p>
            </div>

            {/* Category */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                {t('writeNews.form.category')}
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">{t('writeNews.form.categoryPlaceholder')}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
                ))}
              </select>
            </div>

            {/* Article Type */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <ArticleTypeSelector
                value={formData.articleType}
                onChange={(type) => setFormData({ ...formData, articleType: type })}
              />
            </div>

            {/* Article Images */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
                {t('writeNews.form.articleImages')}
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('writeNews.form.articleImagesDescription')}
              </p>
              {currentDraftId ? (
                <ArticleImageGallery articleId={currentDraftId} editable={true} onImageChange={fetchMediaCounts} />
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 mx-auto mb-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    {t('writeNews.form.saveToUploadImages')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('writeNews.form.saveToUploadImagesDescription')}
                  </p>
                </div>
              )}
            </div>

            {/* Article Video */}
            {currentDraftId ? (
              <ArticleVideoAttachment
                articleId={currentDraftId}
                editable={true}
                userVideos={userVideos || []}
                onVideoChange={fetchMediaCounts}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
                  {t('videoAttachment.addVideoOptional')}
                </label>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 mx-auto mb-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    {t('videoAttachment.saveToAddVideo')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('videoAttachment.saveToAddVideoDescription')}
                  </p>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                {t('writeNews.form.content')} *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => {
                  setFormData({ ...formData, content });
                  setHasUnsavedChanges(true);
                }}
                placeholder={t('writeNews.form.contentPlaceholder')}
              />
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                {t('writeNews.form.tags')}
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder={t('writeNews.form.tagsPlaceholder')}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {t('writeNews.form.addTag')}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Content Quality Indicator */}
            {(formData.title || formData.content) && (
              <ContentQualityIndicator
                title={formData.title}
                content={formData.content}
                imageCount={imageCount}
                videoCount={videoCount}
              />
            )}

            {/* Submit */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? t('writeNews.buttons.publishing') : t('writeNews.buttons.publish')}
              </button>
            </div>
          </form>
        ) : (
          /* Preview */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 rounded-full text-sm">
                {formData.category || t('writeNews.preview.noCategory')}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{formData.title || t('writeNews.preview.titlePlaceholder')}</h1>
            <div className="flex items-center space-x-4 mb-6 text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>{user?.username}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>{new Date().toLocaleDateString('tr-TR')}</span>
              </div>
            </div>

            {/* Article Image Gallery in Preview */}
            {currentDraftId && (
              <div className="mb-6">
                <ArticleImageGallery articleId={currentDraftId} editable={false} />
              </div>
            )}

            {/* Article Video in Preview */}
            {currentDraftId && (
              <div className="mb-6">
                <ArticleVideoAttachment articleId={currentDraftId} editable={false} />
              </div>
            )}

            <div
              className="prose prose-lg max-w-none dark:prose-invert [&_*]:text-gray-900 dark:[&_*]:text-gray-100 break-words max-h-[600px] overflow-y-auto"
              dangerouslySetInnerHTML={{
                __html: formData.content || `<p class="text-gray-500 italic">${t('writeNews.preview.contentPlaceholder')}</p>`
              }}
            />
            {formData.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('writeNews.preview.tagsLabel')}</p>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default WriteNews;
