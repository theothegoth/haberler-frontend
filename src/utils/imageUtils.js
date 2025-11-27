export const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/150?text=No+Image';

  // If it's already a full URL (e.g. Cloudinary or external), return it as is
  if (path.startsWith('http') || path.startsWith('blob:')) {
    return path;
  }

  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Always return the full HTTPS URL for your domain
  // This fixes the Mixed Content error (http://localhost:5000)
  return `https://www.gastehub.com/api${cleanPath}`;
};

// Utility function for image error handling
export const handleImageError = (event) => {
  event.target.style.display = 'none';
};

// Utility function to log image loading for debugging
export const handleImageLoad = (event) => {
  // Image loaded successfully
};
