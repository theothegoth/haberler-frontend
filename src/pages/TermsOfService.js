import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const TermsOfService = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>{t('tos.title') || 'Terms of Service'} - Gaste</title>
      </Helmet>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {t('tos.title') || 'Terms of Service'}
        </h1>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using Gaste, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. User Conduct</h2>
            <p>You agree to use the platform only for lawful purposes. You are prohibited from posting content that is illegal, offensive, defamatory, or infringes on intellectual property rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Content Ownership</h2>
            <p>Users retain ownership of the content they publish. However, by posting content, you grant Gaste a license to display and distribute your content on the platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Termination</h2>
            <p>We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Disclaimer</h2>
            <p>The service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties regarding the reliability or accuracy of any content on the platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at support@gaste.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

