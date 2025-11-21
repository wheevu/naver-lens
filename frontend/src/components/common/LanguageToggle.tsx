import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ko" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center px-2 py-1 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10"
      aria-label="Switch Language"
    >
      <span
        className={`text-xs font-bold transition-colors ${
          i18n.language === "en"
            ? "text-(--naver-green)"
            : "text-gray-400 dark:text-gray-500"
        }`}
      >
        EN
      </span>
      <span className="mx-1 text-gray-300 dark:text-gray-600">|</span>
      <span
        className={`text-xs font-bold transition-colors ${
          i18n.language === "ko"
            ? "text-(--naver-green)"
            : "text-gray-400 dark:text-gray-500"
        }`}
      >
        KR
      </span>
    </button>
  );
};

export default LanguageToggle;
