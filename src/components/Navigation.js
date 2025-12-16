import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import BlockedLink from './BlockedLink';
import NotificationBell from './NotificationBell';
import { useState } from 'react';

const Navigation = () => {
  const { t } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [readDropdownOpen, setReadDropdownOpen] = useState(false);
  const [writeDropdownOpen, setWriteDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileReadOpen, setMobileReadOpen] = useState(false);
  const [mobileWriteOpen, setMobileWriteOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <BlockedLink
              to="/"
              className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <img
                src="/logo2192.png"
                alt="Gaste Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="tracking-wide">Gaste</span>
            </BlockedLink>
          </div>

          {/* Desktop Center Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
            <BlockedLink
              to="/watch"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('nav.watch')}
            </BlockedLink>

            {/* Read - Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setReadDropdownOpen(true)}
              onMouseLeave={() => setReadDropdownOpen(false)}
            >
              <button
                className="text-gray-700 dark:text-gray-200 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <span>{t('nav.read')}</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {readDropdownOpen && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-600">
                  <BlockedLink
                    to="/feed"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t('nav.newsFeed')}
                  </BlockedLink>
                  
                  <BlockedLink
                    to="/my-articles"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t('nav.myArticles')}
                  </BlockedLink>
                  <BlockedLink
                    to="/saved-articles"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t('nav.savedArticles')}
                  </BlockedLink>
                    
                  <BlockedLink
                    to="/search"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t('nav.searchArticles')}
                  </BlockedLink>
                </div>
              )}
            </div>

            {/* Write - Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setWriteDropdownOpen(true)}
              onMouseLeave={() => setWriteDropdownOpen(false)}
            >
              <button
                className="text-gray-700 dark:text-gray-200 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <span>{t('nav.write')}</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {writeDropdownOpen && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-600">
                  <BlockedLink
                    to="/write"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t('nav.writeArticle')}
                  </BlockedLink>
                  <BlockedLink
                    to="/drafts"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t('nav.drafts')}
                  </BlockedLink>
                  <BlockedLink
                    to="/analytics"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t('nav.analytics')}
                  </BlockedLink>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Right Side Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <NotificationBell />

                {/* User Profile */}
                <BlockedLink
                  to={`/profile/${user?.id}`}
                  className="text-gray-600 dark:text-gray-300 text-sm px-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span className="font-semibold">{user?.username}</span>
                </BlockedLink>
                {/* Settings */}
                <BlockedLink
                  to="/settings"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md transition-colors"
                  title={t('nav.settings') || 'Settings'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </BlockedLink>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  aria-label={t('nav.logout')}
                >
                  {t('nav.logout')}
                </button>

                {/* Theme & Language */}
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

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {isAuthenticated && <NotificationBell />}
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 p-2 rounded-md focus:outline-none"
              aria-label="Main menu"
            >
              {!mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto max-h-[80vh]">
          <BlockedLink
            to="/watch"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.watch')}
          </BlockedLink>

          {/* Mobile Read Dropdown */}
          <div>
            <button
              onClick={() => setMobileReadOpen(!mobileReadOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span>{t('nav.read')}</span>
              <svg className={`w-4 h-4 transform transition-transform ${mobileReadOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {mobileReadOpen && (
              <div className="pl-4 space-y-1">
                <BlockedLink to="/feed" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>{t('nav.newsFeed')}</BlockedLink>
                <BlockedLink to="/my-articles" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>{t('nav.myArticles')}</BlockedLink>
                <BlockedLink to="/saved-articles" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>{t('nav.savedArticles')}</BlockedLink>
                <BlockedLink to="/search" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>{t('nav.searchArticles')}</BlockedLink>
              </div>
            )}
          </div>

          {/* Mobile Write Dropdown */}
          <div>
            <button
              onClick={() => setMobileWriteOpen(!mobileWriteOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span>{t('nav.write')}</span>
              <svg className={`w-4 h-4 transform transition-transform ${mobileWriteOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {mobileWriteOpen && (
              <div className="pl-4 space-y-1">
                <BlockedLink to="/write" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>{t('nav.writeArticle')}</BlockedLink>
                <BlockedLink to="/drafts" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>{t('nav.drafts')}</BlockedLink>
                <BlockedLink to="/analytics" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>{t('nav.analytics')}</BlockedLink>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

          {/* Mobile Auth Items */}
          {isAuthenticated ? (
            <>
              <BlockedLink
                to={`/profile/${user?.id}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {user?.username}
              </BlockedLink>
              <BlockedLink
                to="/settings"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.settings') || 'Settings'}
              </BlockedLink>
              <div className="px-3 py-2">
                <LanguageSwitcher />
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <BlockedLink
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.login')}
              </BlockedLink>
              <BlockedLink
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.signup')}
              </BlockedLink>
              <div className="px-3 py-2">
                <LanguageSwitcher />
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;