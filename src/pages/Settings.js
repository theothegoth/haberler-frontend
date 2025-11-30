import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import blockService from '../services/blockService';
import emailPreferencesService from '../services/emailPreferencesService';
import ErrorMessage from '../components/ErrorMessage';
import ProfilePictureUpload from '../components/ProfilePictureUpload';

const Settings = () => {
  const { t } = useTranslation();
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Delete Account State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Blocked users state
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loadingBlocked, setLoadingBlocked] = useState(false);

  // Email preferences state
  const [emailPreferences, setEmailPreferences] = useState({
    weekly_digest: true,
    new_follower: true,
    new_comment: true,
    new_like: false
  });
  const [loadingEmailPrefs, setLoadingEmailPrefs] = useState(false);

  // Load blocked users when the blocked tab is active
  useEffect(() => {
    if (activeTab === 'blocked') {
      loadBlockedUsers();
    } else if (activeTab === 'email') {
      loadEmailPreferences();
    }
  }, [activeTab]);

  const loadBlockedUsers = async () => {
    try {
      setLoadingBlocked(true);
      setError('');
      const data = await blockService.getBlockedUsers();
      setBlockedUsers(data);
    } catch (err) {
      console.error('Error loading blocked users:', err);
      setError('Engellenen kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setLoadingBlocked(false);
    }
  };

  const loadEmailPreferences = async () => {
    try {
      setLoadingEmailPrefs(true);
      setError('');
      const data = await emailPreferencesService.getPreferences();
      setEmailPreferences(data);
    } catch (err) {
      setError(err.response?.data?.error || t('settings.email.loadError') || 'Email tercihleri yüklenirken bir hata oluştu');
    } finally {
      setLoadingEmailPrefs(false);
    }
  };

  const handleEmailPreferenceChange = (key) => {
    setEmailPreferences({
      ...emailPreferences,
      [key]: !emailPreferences[key]
    });
  };

  const handleEmailPreferencesSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      await emailPreferencesService.updatePreferences(emailPreferences);
      setSuccess(t('settings.email.updateSuccess'));
    } catch (err) {
      setError(err.response?.data?.error || t('settings.email.updateError'));
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId, username) => {
    if (!window.confirm(`${username} kullanıcısının engelini kaldırmak istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await blockService.unblockUser(userId);
      setSuccess('Kullanıcının engeli kaldırıldı');
      setTimeout(() => setSuccess(''), 3000);
      await loadBlockedUsers();
    } catch (err) {
      console.error('Error unblocking user:', err);
      setError(err.response?.data?.error || 'Engel kaldırılırken bir hata oluştu');
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (profileForm.username.length < 3) {
      setError(t('settings.profile.usernameMinLength'));
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.put('/auth/profile', {
        username: profileForm.username,
        email: profileForm.email,
        bio: profileForm.bio
      });

      updateUser(response.data.user);
      setSuccess(t('settings.profile.updateSuccess'));
    } catch (err) {
      setError(err.response?.data?.error || t('settings.profile.updateError'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword.length < 6) {
      setError(t('settings.password.passwordMinLength'));
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError(t('settings.password.passwordsMismatch'));
      return;
    }

    try {
      setLoading(true);
      await apiClient.put('/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setSuccess(t('settings.password.changeSuccess'));
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || t('settings.password.changeError'));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploadSuccess = (data) => {
    setSuccess(t('settings.profile.photoUpdateSuccess'));
    updateUser(data.user);
  };

  const handleImageUploadError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
  };

  // Handle Account Deletion
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');
    setIsDeleting(true);

    try {
      await apiClient.delete('/auth/delete-account', {
        data: { password: deletePassword }
      });
      
      // Logout and redirect
      logout();
      navigate('/');
    } catch (err) {
      console.error('Delete account error:', err);
      setDeleteError(err.response?.data?.error || 'Failed to delete account. Please check your password.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('settings.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t('settings.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => handleTabChange('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    activeTab === 'profile'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{t('settings.tabs.profile')}</span>
                </button>
                <button
                  onClick={() => handleTabChange('password')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    activeTab === 'password'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{t('settings.tabs.password')}</span>
                </button>
                <button
                  onClick={() => handleTabChange('email')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    activeTab === 'email'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{t('settings.tabs.email')}</span>
                </button>
                <button
                  onClick={() => handleTabChange('blocked')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    activeTab === 'blocked'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <span className="font-medium">{t('settings.tabs.blocked')}</span>
                </button>
                <button
                  onClick={() => handleTabChange('danger')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    activeTab === 'danger'
                      ? 'bg-red-600 text-white'
                      : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="font-medium">{t('settings.tabs.danger') || 'Danger Zone'}</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              {error && <ErrorMessage message={error} />}
              {success && (
                <div className="bg-green-50 dark:bg-green-900 dark:bg-opacity-20 border-l-4 border-green-500 p-4 mb-6 rounded">
                  <p className="text-green-700 dark:text-green-300">{success}</p>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {t('settings.profile.title')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {t('settings.profile.description')}
                    </p>
                  </div>

                  {/* Profile Picture */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {t('settings.profile.profilePhoto')}
                    </h3>
                    <ProfilePictureUpload
                      currentImage={user?.profile_picture}
                      onUploadSuccess={handleImageUploadSuccess}
                      onUploadError={handleImageUploadError}
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      {t('settings.profile.username')}
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={profileForm.username}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {t('settings.profile.usernameHelper')}
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      {t('settings.profile.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {t('settings.profile.emailHelper')}
                    </p>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      {t('settings.profile.bio')}
                    </label>
                    <textarea
                      name="bio"
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder={t('settings.profile.bioPlaceholder')}
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {t('settings.profile.bioHelper')}
                    </p>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? t('settings.profile.saving') : t('settings.profile.saveChanges')}
                    </button>
                  </div>
                </form>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {t('settings.password.title')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {t('settings.password.description')}
                    </p>
                  </div>

                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      {t('settings.password.currentPassword')}
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      {t('settings.password.newPassword')}
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {t('settings.password.passwordHelper')}
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      {t('settings.password.confirmPassword')}
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? t('settings.password.changing') : t('settings.password.changePassword')}
                    </button>
                  </div>
                </form>
              )}

              {/* Email Preferences Tab */}
              {activeTab === 'email' && (
                <form onSubmit={handleEmailPreferencesSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {t('settings.email.title')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {t('settings.email.description')}
                    </p>
                  </div>

                  {loadingEmailPrefs ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Weekly Digest */}
                      <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <input
                          type="checkbox"
                          id="weekly_digest"
                          checked={emailPreferences.weekly_digest}
                          onChange={() => handleEmailPreferenceChange('weekly_digest')}
                          className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <label htmlFor="weekly_digest" className="block font-semibold text-gray-900 dark:text-white cursor-pointer">
                            📰 {t('settings.email.weeklyDigest')}
                          </label>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t('settings.email.weeklyDigestDesc')}
                          </p>
                        </div>
                      </div>

                      {/* New Follower */}
                      <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <input
                          type="checkbox"
                          id="new_follower"
                          checked={emailPreferences.new_follower}
                          onChange={() => handleEmailPreferenceChange('new_follower')}
                          className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <label htmlFor="new_follower" className="block font-semibold text-gray-900 dark:text-white cursor-pointer">
                            🎉 {t('settings.email.newFollower')}
                          </label>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t('settings.email.newFollowerDesc')}
                          </p>
                        </div>
                      </div>

                      {/* New Comment */}
                      <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <input
                          type="checkbox"
                          id="new_comment"
                          checked={emailPreferences.new_comment}
                          onChange={() => handleEmailPreferenceChange('new_comment')}
                          className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <label htmlFor="new_comment" className="block font-semibold text-gray-900 dark:text-white cursor-pointer">
                            💬 {t('settings.email.newComment')}
                          </label>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t('settings.email.newCommentDesc')}
                          </p>
                        </div>
                      </div>

                      {/* New Like */}
                      <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <input
                          type="checkbox"
                          id="new_like"
                          checked={emailPreferences.new_like}
                          onChange={() => handleEmailPreferenceChange('new_like')}
                          className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <label htmlFor="new_like" className="block font-semibold text-gray-900 dark:text-white cursor-pointer">
                            ❤️ {t('settings.email.newLike')}
                          </label>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t('settings.email.newLikeDesc')}
                          </p>
                        </div>
                      </div>

                      {/* Info Box */}
                      <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border-l-4 border-blue-500 p-4 rounded">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          💡 {t('settings.email.info')}
                        </p>
                      </div>

                      {/* Submit */}
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {loading ? t('settings.email.saving') : t('settings.email.saveChanges')}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}

              {/* Blocked Users Tab */}
              {activeTab === 'blocked' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t('settings.blocked.title')}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {t('settings.blocked.description')}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {blockedUsers.length} {t('settings.blocked.userCount')}
                    </div>
                  </div>

                  {loadingBlocked ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : blockedUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <svg
                        className="w-20 h-20 mx-auto text-gray-400 dark:text-gray-600 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                        />
                      </svg>
                      <p className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">
                        {t('settings.blocked.noBlocked')}
                      </p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm">
                        {t('settings.blocked.noBlockedMessage')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {blockedUsers.map((blocked) => (
                        <div
                          key={blocked.id}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Link
                            to={`/user/${blocked.blocked_id}`}
                            className="flex items-center space-x-3 flex-1 hover:opacity-80 transition-opacity"
                          >
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                              {(blocked.username || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {blocked.username}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t('settings.blocked.blockedDate')}: {new Date(blocked.created_at).toLocaleDateString('tr-TR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </Link>

                          <button
                            onClick={() => handleUnblock(blocked.blocked_id, blocked.username)}
                            className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 flex-shrink-0"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>{t('settings.blocked.unblock')}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Info Box */}
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                          {t('settings.blocked.infoTitle')}
                        </p>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                          <li>{t('settings.blocked.info1')}</li>
                          <li>{t('settings.blocked.info2')}</li>
                          <li>{t('settings.blocked.info3')}</li>
                          <li>{t('settings.blocked.info4')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === 'danger' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                      {t('settings.danger.title') || 'Danger Zone'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {t('settings.danger.description') || 'Irreversible actions related to your account.'}
                    </p>
                  </div>

                  <div className="border border-red-200 dark:border-red-900 rounded-lg p-6 bg-red-50 dark:bg-red-900/10">
                    <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">
                      {t('settings.danger.deleteAccount') || 'Delete Account'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      {t('settings.danger.deleteAccountDesc') || 'Once you delete your account, there is no going back. Your profile will be removed, but your articles and comments will be anonymized and kept on the platform.'}
                    </p>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      {t('settings.danger.deleteButton') || 'Delete My Account'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('settings.danger.confirmDelete') || 'Are you sure?'}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('settings.danger.confirmMessage') || 'Please enter your password to confirm account deletion. This action cannot be undone.'}
            </p>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteAccount}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {t('settings.password.currentPassword')}
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                  placeholder="Password"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                    setDeleteError('');
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  disabled={isDeleting}
                >
                  {t('common.cancel') || 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isDeleting || !deletePassword}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isDeleting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {t('settings.danger.confirmButton') || 'Delete Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
