import { LocalTokenizer } from "@google/genai/tokenizer/node";

const LOCAL_MODEL = "gemini-2.5-flash";

let tokenizer: LocalTokenizer | undefined;

function getTokenizer(): LocalTokenizer {
	if (!tokenizer) {
		tokenizer = new LocalTokenizer(LOCAL_MODEL);
	}
	return tokenizer;
}

export async function countGeminiTokens(text: string): Promise<number> {
	if (!text) return 0;
	const result = await getTokenizer().countTokens(text);
	return result.totalTokens ?? 0;
}
