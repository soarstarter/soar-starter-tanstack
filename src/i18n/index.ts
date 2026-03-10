import i18n from "i18next";
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

function detectInitialLocale(): Locale {
	if (typeof window === "undefined") {
		return defaultLocale;
	}

	const firstSegment = window.location.pathname.split("/").filter(Boolean)[0];

	return supportedLocales.includes(firstSegment as Locale)
		? (firstSegment as Locale)
		: defaultLocale;
}

i18n.use(initReactI18next).init({
	lng: detectInitialLocale(),
	resources: {
		en: { translation: en },
		zh: { translation: zh },
	},
	fallbackLng: defaultLocale,
	supportedLngs: supportedLocales,
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
