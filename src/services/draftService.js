import api from './api';

const draftService = {
  // Save draft (auto-save)
  saveDraft: async (draftData) => {
    const response = await api.post('/drafts/save', draftData);
    return response.data;
  },

  // Get user's draft
  getDraft: async () => {
    const response = await api.get('/drafts');
    return response.data;
  },

  // Delete draft
  deleteDraft: async () => {
    const response = await api.delete('/drafts');
    return response.data;
  },

  // Publish draft as article
  publishDraft: async () => {
    const response = await api.post('/drafts/publish');
    return response.data;
  }
};

export default draftService;
