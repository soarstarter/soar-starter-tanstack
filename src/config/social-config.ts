import {
	Facebook,
	Github,
	Instagram,
	Linkedin,
	Mail,
	Youtube,
} from "lucide-react";
import { createElement } from "react";
import type { MenuItem } from "#/types";
import { websiteConfig } from "./website-config";

export function getSocialLinks(): MenuItem[] {
	const socialLinks: MenuItem[] = [];

	if (websiteConfig.metadata.social?.github) {
		socialLinks.push({
			title: "GitHub",
			href: websiteConfig.metadata.social.github,
			icon: createElement(Github),
			external: true,
		});
	}

	if (websiteConfig.metadata.social?.twitter) {
		socialLinks.push({
			title: "Twitter",
			href: websiteConfig.metadata.social.twitter,
			icon: "x-twitter",
			external: true,
		});
	}

	if (websiteConfig.metadata.social?.youtube) {
		socialLinks.push({
			title: "YouTube",
			href: websiteConfig.metadata.social.youtube,
			icon: createElement(Youtube),
			external: true,
		});
	}

	if (websiteConfig.metadata.social?.linkedin) {
		socialLinks.push({
			title: "LinkedIn",
			href: websiteConfig.metadata.social.linkedin,
			icon: createElement(Linkedin),
			external: true,
		});
	}

	if (websiteConfig.metadata.social?.facebook) {
		socialLinks.push({
			title: "Facebook",
			href: websiteConfig.metadata.social.facebook,
			icon: createElement(Facebook),
			external: true,
		});
	}

	if (websiteConfig.metadata.social?.instagram) {
		socialLinks.push({
			title: "Instagram",
			href: websiteConfig.metadata.social.instagram,
			icon: createElement(Instagram),
			external: true,
		});
	}

	if (websiteConfig.metadata.social?.telegram) {
		socialLinks.push({
			title: "Telegram",
			href: websiteConfig.metadata.social.telegram,
			icon: "telegram",
			external: true,
		});
	}

	if (websiteConfig.mail.supportEmail) {
		socialLinks.push({
			title: "Email",
			href: `mailto:${websiteConfig.mail.supportEmail}`,
			icon: createElement(Mail),
			external: true,
		});
	}

	return socialLinks;
}
