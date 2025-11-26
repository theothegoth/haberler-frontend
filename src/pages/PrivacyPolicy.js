import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>{t('privacy.title') || 'Privacy Policy'} - Gaste</title>
      </Helmet>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {t('privacy.title') || 'Privacy Policy'}
        </h1>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, update your profile, or post content. This may include your name, email address, and profile picture.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to monitor and analyze trends and usage.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Cookies</h2>
            <p>We use cookies to personalize content and analyze our traffic. You can control cookies through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Data Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Third-Party Services</h2>
            <p>Our service may contain links to third-party websites or services (like YouTube) that are not owned or controlled by Gaste. We are not responsible for the privacy practices of these third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@gaste.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

