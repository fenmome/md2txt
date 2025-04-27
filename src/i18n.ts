import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import zhTranslation from './locales/zh.json';

// 获取浏览器语言
const getBrowserLanguage = () => {
  const browserLang = navigator.language;
  return browserLang.startsWith('zh') ? 'zh' : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      zh: {
        translation: zhTranslation,
      },
    },
    lng: getBrowserLanguage(), // 默认语言
    fallbackLng: 'en', // 回退语言
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 