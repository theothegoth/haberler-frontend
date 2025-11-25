import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';

const Home = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <SEO
        title="Home"
        description="Watch YouTube channels, read and write news articles. Follow your favorite news channels and stay updated with the latest news."
        keywords="news, youtube, articles, write news, read news, news platform, journalism"
        url="https://gaste.com"
      />
      <StructuredData type="website" data={{}} />
      <StructuredData type="organization" data={{}} />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t('home.hero.title')}
            <span className="text-blue-600"> {t('home.hero.titleHighlight')}</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('home.hero.subtitle')}
          </p>
          {!isAuthenticated && (
            <div className="flex justify-center space-x-4">
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg"
              >
                {t('home.hero.ctaButton')}
              </Link>
              <Link
                to="/login"
                className="bg-white dark:bg-gray-800 text-blue-600 dark:text-white px-8 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-lg font-semibold border-2 border-blue-600 shadow-lg"
              >
                {t('home.hero.loginButton')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          {t('home.features.title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 - Watch YouTube Videos */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('home.features.feature1.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('home.features.feature1.description')}
            </p>
            <Link
              to="/watch"
              className="inline-block w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-center font-semibold"
            >
              {t('home.features.feature1.button')}
            </Link>
          </div>

          {/* Feature 2 - Read News */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('home.features.feature2.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('home.features.feature2.description')}
            </p>
            <Link
              to="/feed"
              className="inline-block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold"
            >
              {t('home.features.feature2.button')}
            </Link>
          </div>

          {/* Feature 3 - Write News */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('home.features.feature3.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('home.features.feature3.description')}
            </p>
            <Link
              to="/write"
              className="inline-block w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center font-semibold"
            >
              {t('home.features.feature3.button')}
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 dark:bg-gray-800 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 dark:text-gray-300 mb-8">
            {t('home.cta.subtitle')}
          </p>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="inline-block bg-white dark:bg-gray-800 text-blue-600 dark:text-white px-8 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-lg font-semibold shadow-lg"
            >
              {t('home.cta.button')}
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>{t('home.footer.copyright')}</p>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Home;
