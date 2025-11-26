import apiClient from './api';

const articleImageService = {
  // Add image to article
  addImage: async (articleId, imageFile, caption = '') => {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (caption) {
      formData.append('caption', caption);
    }

    const response = await apiClient.post(`/articles/${articleId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all images for an article
  getImages: async (articleId) => {
    const response = await apiClient.get(`/articles/${articleId}/images`);
    return response.data.images;
  },

  // Update image caption
  updateCaption: async (imageId, caption) => {
    const response = await apiClient.patch(`/articles/images/${imageId}/caption`, { caption });
    return response.data;
  },

  // Delete image
  deleteImage: async (imageId) => {
    const response = await apiClient.delete(`/articles/images/${imageId}`);
    return response.data;
  },

  // Reorder images
  reorderImages: async (articleId, imageOrders) => {
    const response = await apiClient.put(`/articles/${articleId}/images/reorder`, { imageOrders });
    return response.data;
  },
};

export default articleImageService;
