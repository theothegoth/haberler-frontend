import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
  const { t, i18n } = useTranslation();
  const isTurkish = i18n.language === 'tr';

  const content = {
    en: {
      title: "Privacy Policy",
      sections: [
        {
          title: "1. Information We Collect",
          content: "We collect information you provide directly to us, such as when you create an account, post content, or communicate with us. This may include your username, email address, and profile information."
        },
        {
          title: "2. How We Use Your Information",
          content: "We use the information we collect to operate, maintain, and improve our Service. This includes personalizing your experience, sending you technical notices, and responding to your comments and questions."
        },
        {
          title: "3. Cookies and Tracking",
          content: "We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
        },
        {
          title: "4. Data Security",
          content: "The security of your data is important to us, but remember that no method of transmission over the Internet is 100% secure. We strive to use commercially acceptable means to protect your Personal Data."
        },
        {
          title: "5. Third-Party Services",
          content: "We may use third-party Service Providers to monitor and analyze the use of our Service (e.g., Google Analytics)."
        },
        {
          title: "6. Children's Privacy",
          content: "Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13."
        },
        {
          title: "7. Contact Us",
          content: "If you have any questions about this Privacy Policy, please contact us at support@gastehub.com."
        }
      ]
    },
    tr: {
      title: "Gizlilik Politikası",
      sections: [
        {
          title: "1. Topladığımız Bilgiler",
          content: "Bir hesap oluşturduğunuzda, içerik yayınladığınızda veya bizimle iletişime geçtiğinizde doğrudan bize sağladığınız bilgileri toplarız. Bu, kullanıcı adınızı, e-posta adresinizi ve profil bilgilerinizi içerebilir."
        },
        {
          title: "2. Bilgilerinizi Nasıl Kullanıyoruz",
          content: "Topladığımız bilgileri Hizmetimizi işletmek, sürdürmek ve geliştirmek için kullanırız. Bu, deneyiminizi kişiselleştirmeyi, teknik bildirimler göndermeyi ve yorumlarınıza ve sorularınıza yanıt vermeyi içerir."
        },
        {
          title: "3. Çerezler ve İzleme",
          content: "Hizmetimizdeki etkinliği izlemek ve belirli bilgileri tutmak için çerezleri ve benzer izleme teknolojilerini kullanırız. Tarayıcınıza tüm çerezleri reddetmesi veya bir çerez gönderildiğinde bunu belirtmesi talimatını verebilirsiniz."
        },
        {
          title: "4. Veri Güvenliği",
          content: "Verilerinizin güvenliği bizim için önemlidir, ancak İnternet üzerinden hiçbir iletim yönteminin %100 güvenli olmadığını unutmayın. Kişisel Verilerinizi korumak için ticari olarak kabul edilebilir yöntemleri kullanmaya gayret ediyoruz."
        },
        {
          title: "5. Üçüncü Taraf Hizmetleri",
          content: "Hizmetimizin kullanımını izlemek ve analiz etmek için üçüncü taraf Hizmet Sağlayıcılarını kullanabiliriz (örneğin, Google Analytics)."
        },
        {
          title: "6. Çocukların Gizliliği",
          content: "Hizmetimiz 13 yaşın altındaki hiç kimseye hitap etmemektedir. 13 yaşın altındaki hiç kimseden bilerek kişisel olarak tanımlanabilir bilgi toplamıyoruz."
        },
        {
          title: "7. İletişim",
          content: "Bu Gizlilik Politikası hakkında herhangi bir sorunuz varsa, lütfen support@gastehub.com adresinden bizimle iletişime geçin."
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

export default PrivacyPolicy;
