import apiClient from './api';

const youtubeService = {
  // User-specific endpoints (require authentication)
  getUserVideos: async (category = null) => {
    const params = {};
    if (category) {
      params.category = category;
    }
    const response = await apiClient.get('/videos/my-videos', { params });
    return response.data;
  },

  getUserChannels: async () => {
    const response = await apiClient.get('/channels/my-channels');
    return response.data;
  },

  addUserChannel: async (input) => {
    const response = await apiClient.post('/channels/add', { input });
    return response.data;
  },

  removeUserChannel: async (channelId) => {
    const response = await apiClient.delete(`/channels/remove/${channelId}`);
    return response.data;
  },

  updateUserVideos: async () => {
    const response = await apiClient.post('/videos/update');
    return response.data;
  },

  // Public cache endpoints (no authentication required)
  getVideosFromCache: async (country = 'TR', category = null) => {
    const params = { country };
    if (category) {
      params.category = category;
    }
    const response = await apiClient.get('/youtube/videos-from-cache', { params });
    return response.data;
  },

  addChannel: async (input, country = 'TR') => {
    const response = await apiClient.post('/youtube/add-channel', {
      input,
      country,
    });
    return response.data;
  },

  updateChannelList: async (country = 'TR') => {
    const response = await apiClient.get('/youtube/load-channel-list', {
      params: { country },
    });
    return response.data;
  },

  updateVideoCache: async (country = 'TR') => {
    const response = await apiClient.get('/youtube/update-video-cache', {
      params: { country },
    });
    return response.data;
  },
};

export default youtubeService;
