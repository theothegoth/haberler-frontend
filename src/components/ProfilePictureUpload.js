import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';

const ProfilePictureUpload = ({ currentImage, onUploadSuccess, onUploadError }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onUploadError('Please select an image file');
      return;
    }

    // Validate file size (5MB for profile pictures)
    if (file.size > 5 * 1024 * 1024) {
      onUploadError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);

      // Upload the profile picture
      const response = await authService.uploadProfilePicture(file);

      // Create preview URL
      const previewUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${response.user.profile_picture}`;
      setPreview(previewUrl);

      // Notify parent component
      onUploadSuccess(response);
    } catch (err) {
      console.error('Upload error:', err);
      onUploadError(err.response?.data?.error || 'Error uploading profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Profile Picture */}
      {preview && (
        <div className="flex items-center space-x-4">
          <img
            src={preview}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
            onError={() => {
              setPreview('');
            }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="px-3 py-2 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          >
            {t('settings.profile.removePhoto') || 'Remove Photo'}
          </button>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex items-center space-x-3">
        <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <span>{uploading ? t('common.uploading') || 'Uploading...' : t('settings.profile.uploadPhoto') || 'Upload Photo'}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Help Text */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t('settings.profile.photoHelper') || 'Upload a profile picture (max 5MB). Supported formats: JPG, PNG, GIF, WEBP'}
      </p>
    </div>
  );
};

export default ProfilePictureUpload;
