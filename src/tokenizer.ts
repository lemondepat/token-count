import { countClaudeTokens } from "./claudeTokenizer";
import { countGeminiTokens } from "./geminiTokenizer";
import { encode as encodeGpt4 } from "gpt-tokenizer/model/gpt-4";
import { encode as encodeGpt4o } from "gpt-tokenizer/model/gpt-4o";
import { encode as encodeGpt5 } from "gpt-tokenizer/model/gpt-5";
import type { ModelId } from "./settings";

type CountFn = (text: string) => number | Promise<number>;

const COUNTERS: Record<ModelId, CountFn> = {
	"gpt-5": (text) => encodeGpt5(text).length,
	"gpt-4o": (text) => encodeGpt4o(text).length,
	"gpt-4": (text) => encodeGpt4(text).length,
	claude: countClaudeTokens,
	gemini: countGeminiTokens,
};

export class Tokenizer {
	constructor(private model: ModelId) {}

	rebuild(model: ModelId): void {
		this.model = model;
	}

	async count(text: string): Promise<number> {
		if (!text) return 0;
		return await COUNTERS[this.model](text);
	}
}
