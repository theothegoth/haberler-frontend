import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArticleImageGallery from '../components/ArticleImageGallery';
import SEO from '../components/SEO';

const ManageArticleImages = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title="Manage Article Images"
        description="Manage images for your article"
        noindex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Manage Article Images
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Upload, reorder, and manage images for your article
                </p>
              </div>
              <button
                onClick={() => navigate('/my-articles')}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Back to My Articles
              </button>
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <ArticleImageGallery articleId={articleId} editable={true} />
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              How to use:
            </h3>
            <ul className="list-disc list-inside text-blue-800 dark:text-blue-300 space-y-1 text-sm">
              <li>Click "Upload Image" to add new images to your article</li>
              <li>Drag images by the move icon to reorder them</li>
              <li>Click the edit icon to add or update image captions</li>
              <li>Click the delete icon to remove an image</li>
              <li>Images are automatically saved when you make changes</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageArticleImages;
