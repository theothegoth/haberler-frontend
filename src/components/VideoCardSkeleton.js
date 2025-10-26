const VideoCardSkeleton = () => {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-48 bg-gray-200 rounded"></div>
    </div>
  );
};

export default VideoCardSkeleton;
