import api from './api';

const newsService = {
  // Create a new article
  createNews: async (newsData) => {
    const response = await api.post('/news', newsData);
    return response.data;
  },

  // Get my articles
  getMyArticles: async (limit = 20, offset = 0) => {
    const response = await api.get(`/news/my/articles?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Get news feed from followed users
  getNewsFeed: async (limit = 20, offset = 0) => {
    const response = await api.get(`/news/feed/my-feed?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Get all public news
  getAllNews: async (limit = 20, offset = 0) => {
    const response = await api.get(`/news/all?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Get a specific news article
  getNewsById: async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  // Get news by specific user
  getUserNews: async (userId, limit = 20, offset = 0) => {
    const response = await api.get(`/news/user/${userId}?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Update news article
  updateNews: async (id, newsData) => {
    const response = await api.put(`/news/${id}`, newsData);
    return response.data;
  },

  // Delete news article
  deleteNews: async (id) => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },

  // Like a news article
  likeNews: async (id) => {
    const response = await api.post(`/news/${id}/like`);
    return response.data;
  },

  // Unlike a news article
  unlikeNews: async (id) => {
    const response = await api.delete(`/news/${id}/like`);
    return response.data;
  },

  // Upload article image
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/news/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default newsService;
