import { encode as encodeGpt4 } from "gpt-tokenizer/model/gpt-4";
import { encode as encodeGpt4o } from "gpt-tokenizer/model/gpt-4o";
import { encode as encodeGpt5 } from "gpt-tokenizer/model/gpt-5";
import type { ModelId } from "./settings";

type EncodeFn = (text: string) => number[];

const ENCODERS: Record<ModelId, EncodeFn> = {
	"gpt-5": encodeGpt5,
	"gpt-4o": encodeGpt4o,
	"gpt-4": encodeGpt4,
};

export class Tokenizer {
	constructor(private model: ModelId) {}

	rebuild(model: ModelId): void {
		this.model = model;
	}

	count(text: string): number {
		if (!text) return 0;
		return ENCODERS[this.model](text).length;
	}
}
