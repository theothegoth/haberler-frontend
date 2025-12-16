import { useState, useEffect, useCallback } from 'react';
import youtubeService from '../services/youtubeService';

const useUserVideos = (category = null, enabled = true) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await youtubeService.getUserVideos(category);
      setVideos(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [category, enabled]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const refetch = () => {
    fetchVideos();
  };

  const checkNewVideos = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      await youtubeService.updateUserVideos();
      await fetchVideos();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
    }
  }, [enabled, fetchVideos]);

  return { videos, loading, error, refetch, checkNewVideos };
};

export default useUserVideos;
