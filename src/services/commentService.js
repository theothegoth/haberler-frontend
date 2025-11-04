import apiClient from './api';

const commentService = {
  getComments: async (newsId) => {
    const response = await apiClient.get(`/comments/${newsId}`);
    return response.data;
  },

  createComment: async (newsId, content) => {
    const response = await apiClient.post(`/comments/${newsId}`, { content });
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  }
};

export default commentService;
