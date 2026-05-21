import { countClaudeTokens } from "./claudeTokenizer";
import { encode as encodeGpt4 } from "gpt-tokenizer/model/gpt-4";
import { encode as encodeGpt4o } from "gpt-tokenizer/model/gpt-4o";
import { encode as encodeGpt5 } from "gpt-tokenizer/model/gpt-5";
import type { ModelId } from "./settings";

type CountFn = (text: string) => number;

const COUNTERS: Record<ModelId, CountFn> = {
	"gpt-5": (text) => encodeGpt5(text).length,
	"gpt-4o": (text) => encodeGpt4o(text).length,
	"gpt-4": (text) => encodeGpt4(text).length,
	claude: countClaudeTokens,
};

export class Tokenizer {
	constructor(private model: ModelId) {}

	rebuild(model: ModelId): void {
		this.model = model;
	}

	count(text: string): number {
		if (!text) return 0;
		return COUNTERS[this.model](text);
	}
}
