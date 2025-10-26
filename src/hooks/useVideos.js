import { useState, useEffect, useCallback } from 'react';
import youtubeService from '../services/youtubeService';

const useVideos = (country = 'TR', category = null) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await youtubeService.getVideosFromCache(country, category);
      setVideos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  }, [country, category]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const refetch = () => {
    fetchVideos();
  };

  return { videos, loading, error, refetch };
};

export default useVideos;
