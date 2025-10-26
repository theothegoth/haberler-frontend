import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      title={i18n.language === 'tr' ? 'Switch to English' : 'Türkçe\'ye geç'}
    >
      {i18n.language === 'tr' ? (
        <>
          <span className="text-2xl">🇹🇷</span>
          <span className="text-sm font-medium text-gray-700">TR</span>
        </>
      ) : (
        <>
          <span className="text-2xl">🇬🇧</span>
          <span className="text-sm font-medium text-gray-700">EN</span>
        </>
      )}
    </button>
  );
};

export default LanguageSwitcher;
