import apiClient from './api';

const bookmarkService = {
  // Save/bookmark an article
  saveArticle: async (newsId) => {
    const response = await apiClient.post(`/bookmarks/${newsId}`);
    return response.data;
  },

  // Remove bookmark
  unsaveArticle: async (newsId) => {
    const response = await apiClient.delete(`/bookmarks/${newsId}`);
    return response.data;
  },

  // Check if article is saved
  checkSaved: async (newsId) => {
    const response = await apiClient.get(`/bookmarks/check/${newsId}`);
    return response.data.isSaved;
  },

  // Get user's saved articles
  getSavedArticles: async (limit = 20, offset = 0) => {
    const response = await apiClient.get(`/bookmarks?limit=${limit}&offset=${offset}`);
    return response.data;
  }
};

export default bookmarkService;
