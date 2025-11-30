import React from 'react';
import { useTranslation } from 'react-i18next';

const Terms = () => {
  const { t, i18n } = useTranslation();
  const isTurkish = i18n.language === 'tr';

  const content = {
    en: {
      title: "Terms of Service",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: "By accessing and using GasteHub (\"the Service\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service."
        },
        {
          title: "2. User Accounts",
          content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must be at least 13 years old to use this Service."
        },
        {
          title: "3. User-Generated Content",
          content: "Users retain ownership of the content they post (articles, comments, etc.). However, by posting content, you grant GasteHub a non-exclusive, worldwide, royalty-free license to use, display, and distribute said content on our platform.\n\nYou agree not to post content that is illegal, hateful, threatening, or violates the rights of others. We reserve the right to remove any content that violates these terms."
        },
        {
          title: "4. Intellectual Property",
          content: "The Service and its original content (excluding user-generated content), features, and functionality are and will remain the exclusive property of GasteHub and its licensors."
        },
        {
          title: "5. Termination",
          content: "We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms."
        },
        {
          title: "6. Changes to Terms",
          content: "We reserve the right to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect."
        },
        {
          title: "7. Contact Us",
          content: "If you have any questions about these Terms, please contact us at support@gastehub.com."
        }
      ]
    },
    tr: {
      title: "Kullanım Koşulları",
      sections: [
        {
          title: "1. Koşulların Kabulü",
          content: "GasteHub'a (\"Hizmet\") erişerek ve kullanarak, bu Kullanım Koşullarına bağlı kalmayı kabul edersiniz. Bu koşulları kabul etmiyorsanız, lütfen Hizmetimizi kullanmayın."
        },
        {
          title: "2. Kullanıcı Hesapları",
          content: "Hesabınızın ve şifrenizin gizliliğini korumaktan siz sorumlusunuz. Hesabınız altında gerçekleşen tüm etkinliklerin sorumluluğunu kabul edersiniz. Bu Hizmeti kullanmak için en az 13 yaşında olmalısınız."
        },
        {
          title: "3. Kullanıcı Tarafından Oluşturulan İçerik",
          content: "Kullanıcılar yayınladıkları içeriğin (makaleler, yorumlar vb.) mülkiyetini elinde tutar. Ancak, içerik yayınlayarak, GasteHub'a bu içeriği platformumuzda kullanma, görüntüleme ve dağıtma konusunda münhasır olmayan, dünya çapında, telifsiz bir lisans vermiş olursunuz.\n\nYasa dışı, nefret dolu, tehditkar veya başkalarının haklarını ihlal eden içerikler yayınlamamayı kabul edersiniz. Bu koşulları ihlal eden herhangi bir içeriği kaldırma hakkımızı saklı tutarız."
        },
        {
          title: "4. Fikri Mülkiyet",
          content: "Hizmet ve orijinal içeriği (kullanıcı tarafından oluşturulan içerik hariç), özellikleri ve işlevselliği GasteHub ve lisans verenlerinin münhasır mülkiyetindedir ve öyle kalacaktır."
        },
        {
          title: "5. Fesih",
          content: "Hesabınızı, Koşulları ihlal etmeniz dahil ancak bunlarla sınırlı olmamak üzere herhangi bir nedenle, önceden haber vermeksizin veya yükümlülük altına girmeksizin derhal feshedebilir veya askıya alabiliriz."
        },
        {
          title: "6. Koşullarda Değişiklik",
          content: "Bu Koşulları istediğimiz zaman değiştirme veya yenileme hakkımızı saklı tutarız. Herhangi bir yeni koşul yürürlüğe girmeden önce en az 30 gün önceden haber vermeye çalışacağız."
        },
        {
          title: "7. İletişim",
          content: "Bu Koşullar hakkında herhangi bir sorunuz varsa, lütfen support@gastehub.com adresinden bizimle iletişime geçin."
        }
      ]
    }
  };

  const currentContent = isTurkish ? content.tr : content.en;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-gray-800 dark:text-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{currentContent.title}</h1>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {isTurkish ? "Son güncelleme:" : "Last updated:"} {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6">
          {currentContent.sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{section.title}</h2>
              <p className="whitespace-pre-line">{section.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Terms;
