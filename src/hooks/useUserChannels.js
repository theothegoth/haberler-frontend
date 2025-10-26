import { useState, useEffect, useCallback } from 'react';
import youtubeService from '../services/youtubeService';

const useUserChannels = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChannels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await youtubeService.getUserChannels();
      setChannels(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      console.error('Error fetching user channels:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const removeChannel = async (channelId) => {
    try {
      await youtubeService.removeUserChannel(channelId);
      await fetchChannels();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Kanal silinemedi'
      };
    }
  };

  const refetch = () => {
    fetchChannels();
  };

  return { channels, loading, error, removeChannel, refetch };
};

export default useUserChannels;
