import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * OptimizedImage Component
 * - Lazy loading with Intersection Observer
 * - WebP format support with fallback
 * - Responsive images with srcset
 * - Loading placeholder
 * - Error handling
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  onLoad,
  onError,
  placeholder = 'blur'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(priority ? src : null);

  // Determine if the image supports WebP
  const getWebPSrc = (originalSrc) => {
    if (!originalSrc) return null;

    // Check if image is from our backend
    if (originalSrc.includes('/uploads/')) {
      const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      return webpSrc;
    }
    return null;
  };

  const handleImageLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleImageError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  // Lazy loading with Intersection Observer
  React.useEffect(() => {
    if (priority || !src) return;

    const img = new Image();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImgSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    const imgElement = document.getElementById(`img-${src}`);
    if (imgElement) {
      observer.observe(imgElement);
    }

    return () => {
      if (imgElement) {
        observer.disconnect();
      }
    };
  }, [src, priority]);

  const webpSrc = getWebPSrc(imgSrc);

  // Error state
  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}
        style={{ width, height }}
      >
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      id={`img-${src}`}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Blur placeholder while loading */}
      {!isLoaded && placeholder === 'blur' && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}

      {/* Actual image with WebP support */}
      {imgSrc && (
        <picture>
          {/* WebP format for modern browsers */}
          {webpSrc && (
            <source srcSet={webpSrc} type="image/webp" />
          )}

          {/* Fallback to original format */}
          <img
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </picture>
      )}
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  priority: PropTypes.bool,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  placeholder: PropTypes.oneOf(['blur', 'none']),
};

export default OptimizedImage;
