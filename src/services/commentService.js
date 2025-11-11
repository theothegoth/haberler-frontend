import apiClient from './api';

const commentService = {
  getComments: async (newsId) => {
    const response = await apiClient.get(`/comments/${newsId}`);
    return response.data;
  },

  createComment: async (newsId, content, parentId = null) => {
    const body = { content };
    if (parentId !== null && parentId !== undefined) {
      body.parentId = parentId;
    }
    const response = await apiClient.post(`/comments/${newsId}`, body);
    return response.data;
  },

  likeComment: async (commentId) => {
    const response = await apiClient.post(`/comments/${commentId}/like`);
    return response.data;
  },

  unlikeComment: async (commentId) => {
    const response = await apiClient.delete(`/comments/${commentId}/like`);
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  }
};

export default commentService;
