import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Contact */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
               <img
                src="/logo2192.png"
                alt="Gaste Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gaste
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {t('home.footer.about') || t('home.subtitle')}
            </p>
            <a 
              href="mailto:support@gastehub.com" 
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@gastehub.com
            </a>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {t('home.footer.platform')}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/watch" className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    {t('nav.watch')}
                  </Link>
                </li>
                <li>
                  <Link to="/feed" className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    {t('nav.read')}
                  </Link>
                </li>
                <li>
                  <Link to="/write" className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    {t('nav.write')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {t('home.footer.legal')}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/terms" className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    {t('home.footer.terms')}
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    {t('home.footer.privacy')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social / Copyright */}
          <div className="flex flex-col justify-between">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {/* Add Social Icons here later if needed */}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {t('home.footer.copyright').replace('© 2025', `© ${currentYear}`)}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

