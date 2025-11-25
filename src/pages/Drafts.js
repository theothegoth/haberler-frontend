import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import draftService from '../services/draftService';

const Drafts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [publishingId, setPublishingId] = useState(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const data = await draftService.getAllDrafts();
      setDrafts(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || t('drafts.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (draftId) => {
    if (!window.confirm(t('drafts.confirmDelete'))) {
      return;
    }

    try {
      setDeletingId(draftId);
      await draftService.deleteDraft(draftId);
      setDrafts(drafts.filter(d => d.id !== draftId));
    } catch (err) {
      alert(err.response?.data?.error || t('drafts.deleteError'));
    } finally {
      setDeletingId(null);
    }
  };

  const handlePublish = async (draftId) => {
    if (!window.confirm(t('drafts.confirmPublish'))) {
      return;
    }

    try {
      setPublishingId(draftId);
      await draftService.publishDraft(draftId);
      navigate('/my-articles');
    } catch (err) {
      alert(err.response?.data?.error || t('drafts.publishError'));
      setPublishingId(null);
    }
  };

  const handleEdit = (draftId) => {
    navigate(`/write?draftId=${draftId}`);
  };

  const handleCreateNew = () => {
    navigate('/write');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <svg className="w-8 h-8 mr-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
              {t('drafts.title')}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('drafts.subtitle')} ({drafts.length}/3)
            </p>
          </div>
          {drafts.length < 3 && (
            <button
              onClick={handleCreateNew}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('drafts.createNew')}
            </button>
          )}
        </div>

        {/* Content */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {drafts.length === 0 && !loading && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <svg className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('drafts.noDrafts')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('drafts.noDraftsMessage')}
            </p>
            <button
              onClick={handleCreateNew}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              {t('drafts.startWriting')}
            </button>
          </div>
        )}

        {/* Drafts List */}
        {drafts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map((draft) => (
              <div key={draft.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-shadow" onClick={() => handleEdit(draft.id)}>
                {/* Image Preview */}
                {draft.image_url && (
                  <div className="relative">
                    <img
                      src={draft.image_url}
                      alt={draft.title || 'Draft'}
                      className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-700"
                    />
                    {draft.video_count > 0 && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
                           title={t('videoAttachment.hasVideo')}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                )}
                {!draft.image_url && draft.video_count > 0 && (
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative">
                    <div className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg shadow-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                      </svg>
                    </div>
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    </svg>
                  </div>
                )}

                {/* Draft Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {draft.title || <span className="text-gray-400 italic">{t('drafts.untitled')}</span>}
                  </h3>

                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>{formatDate(draft.updated_at)}</span>
                    {draft.category && (
                      <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded text-xs font-medium">
                        {t(`categories.${draft.category.toLowerCase()}`)}
                      </span>
                    )}
                  </div>

                  <div className="prose dark:prose-invert max-w-none mb-4 flex-1">
                    <div
                      className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 break-words overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: draft.content || t('drafts.noContent') }}
                    />
                  </div>

                  {/* Tags */}
                  {draft.tags && draft.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {draft.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {draft.tags.length > 3 && (
                        <span className="px-2 py-0.5 text-gray-500 text-xs">
                          +{draft.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(draft.id); }}
                      disabled={deletingId === draft.id}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {deletingId === draft.id ? t('common.deleting') : t('common.delete')}
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(draft.id); }}
                        className="px-3 py-1.5 border border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors text-sm font-medium"
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePublish(draft.id); }}
                        disabled={publishingId === draft.id}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {publishingId === draft.id ? t('drafts.publishing') : t('drafts.publish')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drafts;
