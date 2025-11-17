import api from './api';

const analyticsService = {
  // Get analytics overview
  getOverview: async () => {
    const response = await api.get('/analytics/overview');
    return response.data;
  },

  // Get views over time
  getViewsOverTime: async (days = 30) => {
    const response = await api.get('/analytics/views-over-time', { params: { days } });
    return response.data;
  },

  // Get engagement metrics
  getEngagementMetrics: async (days = 30) => {
    const response = await api.get('/analytics/engagement', { params: { days } });
    return response.data;
  },

  // Get follower growth
  getFollowerGrowth: async (days = 30) => {
    const response = await api.get('/analytics/follower-growth', { params: { days } });
    return response.data;
  },

  // Get popular articles
  getPopularArticles: async (limit = 10, sortBy = 'views') => {
    const response = await api.get('/analytics/popular-articles', { params: { limit, sortBy } });
    return response.data;
  },

  // Get article performance details
  getArticlePerformance: async (newsId) => {
    const response = await api.get(`/analytics/article/${newsId}`);
    return response.data;
  },

  // Get top categories
  getTopCategories: async () => {
    const response = await api.get('/analytics/top-categories');
    return response.data;
  }
};

export default analyticsService;
