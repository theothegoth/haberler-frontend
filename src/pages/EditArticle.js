import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import newsService from '../services/newsService';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageUpload from '../components/ImageUpload';
import RichTextEditor from '../components/RichTextEditor';

const EditArticle = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    imageUrl: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);

  const categories = [
    'Politika', 'Ekonomi', 'Spor', 'Teknoloji', 'Sağlık',
    'Eğitim', 'Kültür', 'Sanat', 'Bilim', 'Dünya', 'Diğer'
  ];

  const loadArticle = useCallback(async () => {
    try {
      setLoading(true);
      const article = await newsService.getNewsById(id);
      setFormData({
        title: article.title || '',
        content: article.content || '',
        category: article.category || '',
        imageUrl: article.image_url || '',
        tags: article.tags || []
      });
    } catch (err) {
      setError(err.response?.data?.error || t('editArticle.loadError'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

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

  const handleImageUploaded = (imageUrl) => {
    setFormData({
      ...formData,
      imageUrl: imageUrl
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.title.length < 10) {
      setError(t('writeNews.form.titleTooShort'));
      return;
    }

    if (formData.content.length < 100) {
      setError(t('writeNews.form.contentTooShort'));
      return;
    }

    try {
      setSubmitting(true);
      await newsService.updateNews(id, formData);
      setSuccess(t('editArticle.success'));
      setTimeout(() => {
        navigate('/my-articles');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || t('editArticle.error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('editArticle.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">{t('editArticle.subtitle')}</p>
              </div>
            </div>
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

        {error && <ErrorMessage message={error} />}
        {success && (
          <div className="bg-green-50 dark:bg-green-900 dark:bg-opacity-20 border-l-4 border-green-500 p-4 mb-6 rounded">
            <p className="text-green-700 dark:text-green-300">{success}</p>
          </div>
        )}

        {!preview ? (
          /* Editor Form */
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{formData.title.length} / {t('writeNews.form.minCharacters')} 10 {t('writeNews.form.titleHelper')}</p>
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
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Article Image
              </label>
              <ImageUpload
                currentImageUrl={formData.imageUrl}
                onImageUploaded={handleImageUploaded}
              />
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                {t('writeNews.form.content')} *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder={t('writeNews.form.contentPlaceholder')}
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t('writeNews.form.minCharacters')} 100 characters minimum
              </p>
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

            {/* Submit */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/my-articles')}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-4 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  {t('editArticle.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? t('editArticle.saving') : t('editArticle.saveChanges')}
                </button>
              </div>
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
            {formData.imageUrl && (
              <img
                src={formData.imageUrl.startsWith('http') ? formData.imageUrl : `http://localhost:5000${formData.imageUrl}`}
                alt={formData.title}
                className="w-full max-h-[600px] object-contain rounded-lg mb-6 bg-gray-100 dark:bg-gray-700"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <div className="prose max-w-none text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
              {formData.content || t('writeNews.preview.contentPlaceholder')}
            </div>
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
  );
};

export default EditArticle;
