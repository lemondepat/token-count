type TokenFn = (count: number) => string;

// Returns the localized word for "token(s)" based on Obsidian's UI locale.
// Languages that use "token" as a loanword (fr, es, it, pt, nl, tr, id…)
// fall through to the English default.
const TOKEN_WORDS: Record<string, TokenFn> = {
	en: (n) => (n === 1 ? "token" : "tokens"),
	de: (n) => (n === 1 ? "Token" : "Tokens"),
	// East Asian — no grammatical plural
	zh: () => "词元",
	ja: () => "トークン",
	ko: () => "토큰",
	// Slavic plural rules
	ru: (n) => {
		const mod10 = n % 10;
		const mod100 = n % 100;
		if (mod100 >= 11 && mod100 <= 19) return "токенов";
		if (mod10 === 1) return "токен";
		if (mod10 >= 2 && mod10 <= 4) return "токена";
		return "токенов";
	},
	uk: (n) => {
		const mod10 = n % 10;
		const mod100 = n % 100;
		if (mod100 >= 11 && mod100 <= 19) return "токенів";
		if (mod10 === 1) return "токен";
		if (mod10 >= 2 && mod10 <= 4) return "токени";
		return "токенів";
	},
	pl: (n) => {
		if (n === 1) return "token";
		const mod10 = n % 10;
		const mod100 = n % 100;
		if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14))
			return "tokeny";
		return "tokenów";
	},
	cs: (n) => {
		if (n === 1) return "token";
		if (n >= 2 && n <= 4) return "tokeny";
		return "tokenů";
	},
	// Arabic dual/plural
	ar: (n) => (n === 1 ? "رمز" : "رموز"),
};

/** Returns the locale-appropriate word for "token(s)" given a count. */
export function getTokenWord(count: number): string {
	// window.moment is always available in Obsidian (bundled).
	const locale: string =
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).moment?.locale?.() ?? "en";

	// Try full locale first (e.g. "zh-cn"), then language prefix (e.g. "zh").
	const full = locale.toLowerCase();
	const lang = full.split("-")[0];

	const fn = TOKEN_WORDS[full] ?? TOKEN_WORDS[lang] ?? TOKEN_WORDS.en;
	return fn(count);
}
