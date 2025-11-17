import api from './api';

const recommendationService = {
  // Get similar articles (You might also like)
  getSimilarArticles: async (newsId, limit = 5) => {
    const response = await api.get(`/recommendations/similar/${newsId}`, { params: { limit } });
    return response.data;
  },

  // Get trending articles
  getTrendingArticles: async (limit = 10, days = 7) => {
    const response = await api.get('/recommendations/trending', { params: { limit, days } });
    return response.data;
  },

  // Get personalized feed based on reading history
  getPersonalizedFeed: async (limit = 20, offset = 0) => {
    const response = await api.get('/recommendations/personalized', { params: { limit, offset } });
    return response.data;
  },

  // Get articles from followed authors
  getFollowingFeed: async (limit = 20, offset = 0) => {
    const response = await api.get('/recommendations/following', { params: { limit, offset } });
    return response.data;
  },

  // Get user's reading preferences
  getUserPreferences: async () => {
    const response = await api.get('/recommendations/preferences');
    return response.data;
  }
};

export default recommendationService;
