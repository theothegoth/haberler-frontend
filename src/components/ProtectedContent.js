import { useEffect } from 'react';
import PropTypes from 'prop-types';

const ProtectedContent = ({ children, authorName, showWatermark = true }) => {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable text selection
    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable copy
    const handleCopy = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts for copying
    const handleKeyDown = (e) => {
      // Ctrl+C, Ctrl+X, Ctrl+A, Ctrl+U, F12, Ctrl+Shift+I
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'x' || e.key === 'a' || e.key === 'u')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable drag
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return (
    <div className="relative">
      {/* Watermark overlay */}
      {showWatermark && (
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-5">
          <div className="absolute inset-0 flex flex-wrap items-center justify-center transform rotate-[-45deg] scale-150">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="text-gray-900 font-bold text-4xl m-8 whitespace-nowrap"
              >
                © {authorName || 'Gaste'} - Gaste.com
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content with protection */}
      <div
        className="select-none"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      >
        {children}
      </div>

      {/* Copyright notice */}
      <div className="mt-4 text-xs text-gray-500 italic border-t pt-2">
        © {new Date().getFullYear()} {authorName || 'Gaste User'}. Tüm hakları saklıdır.
        Bu içerik telif hakkı ile korunmaktadır ve izinsiz kopyalanamaz.
      </div>
    </div>
  );
};

ProtectedContent.propTypes = {
  children: PropTypes.node.isRequired,
  authorName: PropTypes.string,
  showWatermark: PropTypes.bool
};

export default ProtectedContent;
