import apiClient from './api';

const reportService = {
  /**
   * Report an article or comment
   * @param {string} reportedType - Type of content ('article' or 'comment')
   * @param {number} reportedId - ID of the content to report
   * @param {string} reason - Reason for reporting (max 100 chars)
   * @param {string} description - Optional detailed description (max 1000 chars)
   * @returns {Promise} Response with success message and report details
   */
  createReport: async (reportedType, reportedId, reason, description = '') => {
    const response = await apiClient.post('/reports', {
      reportedType,
      reportedId,
      reason,
      description: description || undefined
    });
    return response.data;
  },

  /**
   * Get all reports (Admin only)
   * @param {string} status - Optional status filter ('pending', 'reviewed', 'action_taken', 'dismissed')
   * @param {number} limit - Number of reports to fetch (default 50)
   * @param {number} offset - Offset for pagination (default 0)
   * @returns {Promise<Array>} Array of reports with details
   */
  getReports: async (status = null, limit = 50, offset = 0) => {
    const params = { limit, offset };
    if (status) {
      params.status = status;
    }
    const response = await apiClient.get('/reports', { params });
    return response.data;
  },

  /**
   * Get report statistics (Admin only)
   * @returns {Promise<Object>} Count of reports by status
   */
  getReportStats: async () => {
    const response = await apiClient.get('/reports/stats');
    return response.data;
  },

  /**
   * Get single report details (Admin only)
   * @param {number} reportId - The ID of the report
   * @returns {Promise<Object>} Report details with content
   */
  getReportById: async (reportId) => {
    const response = await apiClient.get(`/reports/${reportId}`);
    return response.data;
  },

  /**
   * Update report status (Admin only)
   * @param {number} reportId - The ID of the report
   * @param {string} status - New status ('pending', 'reviewed', 'action_taken', 'dismissed')
   * @param {string} adminNotes - Optional admin notes (max 1000 chars)
   * @returns {Promise} Response with success message
   */
  updateReportStatus: async (reportId, status, adminNotes = '') => {
    const response = await apiClient.patch(`/reports/${reportId}/status`, {
      status,
      adminNotes: adminNotes || undefined
    });
    return response.data;
  },

  /**
   * Delete a report (Admin only)
   * @param {number} reportId - The ID of the report to delete
   * @returns {Promise} Response with success message
   */
  deleteReport: async (reportId) => {
    const response = await apiClient.delete(`/reports/${reportId}`);
    return response.data;
  }
};

// Common report reasons for use in UI
export const REPORT_REASONS = [
  'Spam',
  'Uygunsuz İçerik',
  'Taciz',
  'Yanlış Bilgi',
  'Telif Hakkı İhlali',
  'Nefret Söylemi',
  'Şiddet',
  'Diğer'
];

// Report status options for admin UI
export const REPORT_STATUSES = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  ACTION_TAKEN: 'action_taken',
  DISMISSED: 'dismissed'
};

export default reportService;
