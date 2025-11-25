import apiClient from './api';

const adminService = {
  // ============= ANALYTICS =============
  getDashboardStats: () => {
    return apiClient.get('/admin/analytics/dashboard');
  },

  getGrowthData: (days = 30) => {
    return apiClient.get('/admin/analytics/growth', { params: { days } });
  },

  getTopArticles: (limit = 10, metric = 'views') => {
    return apiClient.get('/admin/analytics/top-articles', { params: { limit, metric } });
  },

  getTopUsers: (limit = 10) => {
    return apiClient.get('/admin/analytics/top-users', { params: { limit } });
  },

  getCategoryStats: () => {
    return apiClient.get('/admin/analytics/categories');
  },

  getRecentActivity: (limit = 20) => {
    return apiClient.get('/admin/analytics/activity', { params: { limit } });
  },

  // ============= USER MANAGEMENT =============
  getAllUsers: (page = 1, limit = 20, search = '', role = '') => {
    return apiClient.get('/admin/users', { params: { page, limit, search, role } });
  },

  getUserById: (id) => {
    return apiClient.get(`/admin/users/${id}`);
  },

  toggleUserBan: (id, reason = '') => {
    return apiClient.patch(`/admin/users/${id}/ban`, { reason });
  },

  updateUserRole: (id, role) => {
    return apiClient.patch(`/admin/users/${id}/role`, { role });
  },

  deleteUser: (id) => {
    return apiClient.delete(`/admin/users/${id}`);
  },

  // ============= CONTENT MANAGEMENT =============
  getAllArticles: (page = 1, limit = 20, search = '', category = '', author = '') => {
    return apiClient.get('/admin/articles', { params: { page, limit, search, category, author } });
  },

  getArticleById: (id) => {
    return apiClient.get(`/admin/articles/${id}`);
  },

  deleteArticle: (id) => {
    return apiClient.delete(`/admin/articles/${id}`);
  },

  getArticleStats: () => {
    return apiClient.get('/admin/articles/stats');
  },

  // ============= REPORT MANAGEMENT =============
  getAllReports: (page = 1, limit = 20, type = '', status = 'pending') => {
    return apiClient.get('/admin/reports', { params: { page, limit, type, status } });
  },

  getReportById: (id) => {
    return apiClient.get(`/admin/reports/${id}`);
  },

  updateReportStatus: (id, status, action = null, adminNotes = '') => {
    return apiClient.patch(`/admin/reports/${id}`, { status, action, adminNotes });
  },

  getReportStats: () => {
    return apiClient.get('/admin/reports/stats');
  }
};

export default adminService;
