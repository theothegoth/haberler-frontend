import apiClient from './api';

const articleVideoService = {
  // Add video to article/draft
  addVideo: async (articleId, videoId) => {
    const response = await apiClient.post(`/articles/${articleId}/videos`, { videoId });
    return response.data;
  },

  // Get all videos for an article/draft
  getVideos: async (articleId) => {
    const response = await apiClient.get(`/articles/${articleId}/videos`);
    return response.data.videos;
  },

  // Delete video
  deleteVideo: async (videoId) => {
    const response = await apiClient.delete(`/articles/videos/${videoId}`);
    return response.data;
  },

  // Get single video
  getVideo: async (videoId) => {
    const response = await apiClient.get(`/articles/videos/${videoId}`);
    return response.data.video;
  },
};

export default articleVideoService;
