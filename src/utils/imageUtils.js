// Utility function to construct proper image URLs
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Otherwise, prepend the backend URL
  const backendUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${backendUrl}${imageUrl}`;
};

// Utility function for image error handling
export const handleImageError = (event) => {
  console.error('Image failed to load:', event.target.src);
  event.target.style.display = 'none';
};

// Utility function to log image loading for debugging
export const handleImageLoad = (event) => {
  console.log('Image loaded successfully:', event.target.src);
};
