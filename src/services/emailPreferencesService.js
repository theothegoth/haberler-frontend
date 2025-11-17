import apiClient from './api';

const emailPreferencesService = {
  // Get email preferences
  getPreferences: async () => {
    const response = await apiClient.get('/email-preferences');
    return response.data;
  },

  // Update email preferences
  updatePreferences: async (preferences) => {
    const response = await apiClient.put('/email-preferences', preferences);
    return response.data;
  }
};

export default emailPreferencesService;
