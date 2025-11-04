import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import BlockedLink from './BlockedLink';
import NotificationBell from './NotificationBell';

const Navigation = () => {
  const { t } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <BlockedLink
              to="/"
              className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <svg
                className="w-8 h-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 6v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              <span className="tracking-wide">Gaste</span>
            </BlockedLink>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <BlockedLink
                  to="/dashboard"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t('nav.videoDashboard')}
                </BlockedLink>
                <BlockedLink
                  to="/feed"
                  className="text-gray-700 dark:text-gray-200 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t('nav.newsFeed')}
                </BlockedLink>
                <BlockedLink
                  to="/explore"
                  className="text-gray-700 dark:text-gray-200 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span>{t('nav.explore')}</span>
                </BlockedLink>
                <BlockedLink
                  to="/write"
                  className="text-gray-700 dark:text-gray-200 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span>{t('nav.write')}</span>
                </BlockedLink>
                <BlockedLink
                  to="/my-articles"
                  className="text-gray-700 dark:text-gray-200 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t('nav.myArticles')}
                </BlockedLink>
                <BlockedLink
                  to="/saved-articles"
                  className="text-gray-700 dark:text-gray-200 hover:text-yellow-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t('nav.savedArticles')}
                </BlockedLink>
                <BlockedLink
                  to="/settings"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span>{t('nav.settings')}</span>
                </BlockedLink>
                
                {/* Notification Bell */}
                <NotificationBell />
                
                <span className="text-gray-600 dark:text-gray-300 text-sm px-2">
                  <span className="font-semibold">{user?.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  aria-label={t('nav.logout')}
                >
                  {t('nav.logout')}
                </button>
                <ThemeToggle />
                <LanguageSwitcher />
              </>
            ) : (
              <>
                <BlockedLink
                  to="/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t('nav.login')}
                </BlockedLink>
                <BlockedLink
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  {t('nav.signup')}
                </BlockedLink>
                <ThemeToggle />
                <LanguageSwitcher />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
