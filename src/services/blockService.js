import apiClient from './api';

const blockService = {
  /**
   * Block a user
   * @param {number} userId - The ID of the user to block
   * @returns {Promise} Response with success message and block details
   */
  blockUser: async (userId) => {
    const response = await apiClient.post(`/blocks/${userId}`);
    return response.data;
  },

  /**
   * Unblock a user
   * @param {number} userId - The ID of the user to unblock
   * @returns {Promise} Response with success message
   */
  unblockUser: async (userId) => {
    const response = await apiClient.delete(`/blocks/${userId}`);
    return response.data;
  },

  /**
   * Get list of all blocked users
   * @returns {Promise<Array>} Array of blocked users with details
   */
  getBlockedUsers: async () => {
    const response = await apiClient.get('/blocks');
    return response.data;
  },

  /**
   * Check if a specific user is blocked
   * @param {number} userId - The ID of the user to check
   * @returns {Promise<Object>} Object with isBlocked boolean
   */
  checkIfBlocked: async (userId) => {
    const response = await apiClient.get(`/blocks/check/${userId}`);
    return response.data;
  }
};

export default blockService;
