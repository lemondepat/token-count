import claude from "@anthropic-ai/tokenizer/claude.json";
import { Tiktoken, type TiktokenBPE } from "js-tiktoken";

let cached: Tiktoken | undefined;

function getClaudeTokenizer(): Tiktoken {
	if (!cached) {
		const bpe: TiktokenBPE = {
			pat_str: claude.pat_str,
			special_tokens: claude.special_tokens,
			bpe_ranks: claude.bpe_ranks,
		};
		cached = new Tiktoken(bpe);
	}
	return cached;
}

/** Claude tokenizer per Anthropic ranks + NFKC normalization. */
export function countClaudeTokens(text: string): number {
	if (!text) return 0;
	return getClaudeTokenizer().encode(text.normalize("NFKC"), "all").length;
}
