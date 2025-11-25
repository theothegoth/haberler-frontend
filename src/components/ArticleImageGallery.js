import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiX, FiEdit2, FiMove, FiCheck } from 'react-icons/fi';
import articleImageService from '../services/articleImageService';

const SortableImageItem = ({ image, onDelete, onUpdateCaption, isEditing, setIsEditing, t }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const [caption, setCaption] = useState(image.caption || '');
  const [isEditingCaption, setIsEditingCaption] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSaveCaption = async () => {
    try {
      await onUpdateCaption(image.id, caption);
      setIsEditingCaption(false);
    } catch (error) {
      alert(t('writeNews.form.failedToUpdateCaption'));
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative group">
        <img
          src={image.image_url}
          alt={image.caption || 'Article image'}
          className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-800"
        />

        <div className="absolute top-2 right-2 flex gap-2">
          <button
            {...attributes}
            {...listeners}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition cursor-move"
            title={t('writeNews.form.dragToReorder')}
          >
            <FiMove size={16} />
          </button>
          <button
            onClick={() => setIsEditingCaption(!isEditingCaption)}
            className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition"
            title={t('writeNews.form.editCaption')}
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(image.id)}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
            title={t('writeNews.form.deleteImage')}
          >
            <FiX size={16} />
          </button>
        </div>
      </div>

      <div className="p-3">
        {isEditingCaption ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={t('writeNews.form.addCaption')}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSaveCaption}
              className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition"
            >
              <FiCheck size={16} />
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-300 break-words overflow-wrap-anywhere">
            {image.caption || t('writeNews.form.noCaption')}
          </p>
        )}
      </div>
    </div>
  );
};

const ArticleImageGallery = ({ articleId, editable = false }) => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (articleId) {
      loadImages();
    } else {
      setLoading(false);
    }
  }, [articleId]);

  const loadImages = async () => {
    if (!articleId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await articleImageService.getImages(articleId);
      setImages(data);
    } catch (err) {
      setError(t('writeNews.form.failedToLoadImages'));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if already at max limit
    if (images.length >= 5) {
      alert(t('writeNews.form.maxImagesReached'));
      e.target.value = ''; // Reset file input
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(t('writeNews.form.fileSizeError'));
      e.target.value = ''; // Reset file input
      return;
    }

    try {
      setUploading(true);
      setError('');
      await articleImageService.addImage(articleId, file);
      await loadImages();
      e.target.value = ''; // Reset file input after successful upload
    } catch (err) {
      setError(err.response?.data?.error || t('writeNews.form.failedToUploadImage'));
      e.target.value = ''; // Reset file input on error
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm(t('writeNews.form.deleteImageConfirm'))) return;

    try {
      await articleImageService.deleteImage(imageId);
      setImages(images.filter(img => img.id !== imageId));
    } catch (err) {
      alert(t('writeNews.form.failedToDeleteImage'));
    }
  };

  const handleUpdateCaption = async (imageId, caption) => {
    try {
      await articleImageService.updateCaption(imageId, caption);
      setImages(images.map(img =>
        img.id === imageId ? { ...img, caption } : img
      ));
    } catch (err) {
      throw err;
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update display order on server
        const imageOrders = newItems.map((img, index) => ({
          id: img.id,
          display_order: index
        }));

        articleImageService.reorderImages(articleId, imageOrders).catch(() => {
          alert(t('writeNews.form.failedToSaveOrder'));
        });

        return newItems;
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">{t('writeNews.form.loadingImages')}</div>;
  }

  return (
    <div className="space-y-4">
      {editable && (
        <div className="flex items-center gap-4">
          <label className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            images.length >= 5 || uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
          } text-white`}>
            <span>{t('writeNews.form.uploadImage')} ({images.length}/5)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading || images.length >= 5}
            />
          </label>
          {uploading && <span className="text-sm text-gray-600 dark:text-gray-400">{t('writeNews.form.uploading')}</span>}
          {images.length >= 5 && (
            <span className="text-sm text-orange-600 dark:text-orange-400">
              {t('writeNews.form.maxImagesReached')}
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {images.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('writeNews.form.noImages')} {editable && t('writeNews.form.uploadToGetStarted')}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map(img => img.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <SortableImageItem
                  key={image.id}
                  image={image}
                  onDelete={editable ? handleDeleteImage : undefined}
                  onUpdateCaption={editable ? handleUpdateCaption : undefined}
                  isEditing={editable}
                  t={t}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default ArticleImageGallery;
