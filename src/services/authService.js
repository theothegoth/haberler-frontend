import apiClient from './api';

const authService = {
  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data.user;
  },

  // Update user profile (username, email, bio)
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/auth/profile', profileData);
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await apiClient.post('/auth/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.put('/auth/password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};

export default authService;
