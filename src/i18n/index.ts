import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "../../messages/en.json";
import zh from "../../messages/zh.json";

export const supportedLocales = ["en", "zh"] as const;
export type Locale = (typeof supportedLocales)[number];
export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
	en: "English",
	zh: "中文",
};

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: { translation: en },
			zh: { translation: zh },
		},
		fallbackLng: defaultLocale,
		supportedLngs: supportedLocales,
		interpolation: {
			escapeValue: false,
		},
		detection: {
			order: ["cookie", "localStorage", "navigator"],
			caches: ["cookie", "localStorage"],
			cookieOptions: { path: "/", sameSite: "lax" },
		},
	});

export default i18n;
