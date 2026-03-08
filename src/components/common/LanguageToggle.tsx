import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { type Locale, localeLabels, supportedLocales } from "#/i18n";

export function LanguageToggle() {
	const { i18n } = useTranslation();
	const currentLocale = i18n.language;

	function switchLocale(newLocale: Locale) {
		i18n.changeLanguage(newLocale);
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					aria-label={`Current language: ${currentLocale}`}
					title={`Current language: ${currentLocale}`}
					className="relative ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all hover:bg-accent hover:text-accent-foreground"
				>
					<Globe className="h-4 w-4 transition-all" />
					<span className="sr-only">Switch language</span>
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-[120px] p-2">
				<div className="flex flex-col space-y-1">
					{supportedLocales.map((locale) => (
						<button
							key={locale}
							type="button"
							className={`flex items-center rounded-md px-2 py-1.5 transition-colors hover:bg-accent hover:text-accent-foreground ${currentLocale === locale ? "bg-accent" : ""}`}
							onClick={() => switchLocale(locale)}
						>
							{localeLabels[locale]}
						</button>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
