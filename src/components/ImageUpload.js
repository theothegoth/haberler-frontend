import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import newsService from '../services/newsService';

const ImageUpload = ({ currentImageUrl, onImageUploaded }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentImageUrl || '');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Upload the image
      const response = await newsService.uploadImage(file);

      // Create preview URL
      const previewUrl = `http://localhost:5000${response.imageUrl}`;
      setPreview(previewUrl);

      // Notify parent component
      onImageUploaded(response.imageUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center space-x-3">
        <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {preview && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border-l-4 border-red-500 p-3 rounded">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Image Preview */}
      {preview && (
        <div className="relative rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
          <img
            src={preview}
            alt="Article preview"
            className="w-full h-64 object-cover"
            onError={() => {
              setPreview('');
              setError('Failed to load image');
            }}
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            Preview
          </div>
        </div>
      )}

      {/* Help Text */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Upload an image for your article (max 10MB). Supported formats: JPG, PNG, GIF, WEBP
      </p>
    </div>
  );
};

export default ImageUpload;
