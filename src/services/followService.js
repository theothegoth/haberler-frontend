import api from './api';

const followService = {
  // Follow a user
  followUser: async (userId) => {
    const response = await api.post(`/follow/${userId}`);
    return response.data;
  },

  // Unfollow a user
  unfollowUser: async (userId) => {
    const response = await api.delete(`/follow/${userId}`);
    return response.data;
  },

  // Check if following a user
  checkFollowing: async (userId) => {
    const response = await api.get(`/follow/${userId}/check`);
    return response.data;
  },

  // Get user's followers
  getFollowers: async (userId) => {
    const response = await api.get(`/follow/${userId}/followers`);
    return response.data;
  },

  // Get users that the user is following
  getFollowing: async (userId) => {
    const response = await api.get(`/follow/${userId}/following`);
    return response.data;
  },

  // Get my followers
  getMyFollowers: async () => {
    const response = await api.get('/follow/my/followers');
    return response.data;
  },

  // Get users I'm following
  getMyFollowing: async () => {
    const response = await api.get('/follow/my/following');
    return response.data;
  },

  // Get follow counts
  getFollowCounts: async (userId) => {
    const response = await api.get(`/follow/${userId}/counts`);
    return response.data;
  },

  // Get suggested users to follow
  getSuggestedUsers: async (limit = 10) => {
    const response = await api.get(`/follow/suggestions/users?limit=${limit}`);
    return response.data;
  }
};

export default followService;
