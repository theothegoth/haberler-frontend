import api from './api';

const draftService = {
  // Create a new draft
  createDraft: async (draftData) => {
    const response = await api.post('/drafts', draftData);
    return response.data;
  },

  // Update an existing draft
  updateDraft: async (draftId, draftData) => {
    const response = await api.put(`/drafts/${draftId}`, draftData);
    return response.data;
  },

  // Get all drafts for the user
  getAllDrafts: async () => {
    const response = await api.get('/drafts');
    return response.data;
  },

  // Get a single draft by ID
  getDraft: async (draftId) => {
    const response = await api.get(`/drafts/${draftId}`);
    return response.data;
  },

  // Delete a draft
  deleteDraft: async (draftId) => {
    const response = await api.delete(`/drafts/${draftId}`);
    return response.data;
  },

  // Publish draft as article
  publishDraft: async (draftId) => {
    const response = await api.post(`/drafts/${draftId}/publish`);
    return response.data;
  }
};

export default draftService;
