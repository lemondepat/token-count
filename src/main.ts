import { MarkdownView, Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	normalizeModelId,
	TokenCountSettingTab,
	type TokenCountSettings,
} from "./settings";
import {
	placeStatusBarAfterWordCount,
	scheduleStatusBarPlacement,
} from "./statusBarPlacement";
import { Tokenizer } from "./tokenizer";

const DEBOUNCE_MS = 200;

export default class TokenCountPlugin extends Plugin {
	settings: TokenCountSettings = DEFAULT_SETTINGS;
	private statusBarEl?: HTMLElement;
	private tokenizer?: Tokenizer;
	private debounceTimer?: number;
	private cancelStatusBarPlacement?: () => void;

	async onload() {
		await this.loadSettings();
		this.rebuildTokenizer();

		this.statusBarEl = this.addStatusBarItem();
		this.statusBarEl.addClass("mod-clickable");
		this.statusBarEl.setAttribute("aria-label", "Token count for active note");
		this.cancelStatusBarPlacement = scheduleStatusBarPlacement(this.statusBarEl);

		this.app.workspace.onLayoutReady(() => {
			if (this.statusBarEl) {
				placeStatusBarAfterWordCount(this.statusBarEl);
			}
		});

		this.registerEvent(
			this.app.workspace.on("active-leaf-change", () => {
				void this.updateTokenCount();
			}),
		);

		this.registerEvent(
			this.app.workspace.on("editor-change", () => {
				this.scheduleUpdate();
			}),
		);

		this.registerEvent(
			this.app.vault.on("modify", () => {
				this.scheduleUpdate();
			}),
		);

		this.addSettingTab(new TokenCountSettingTab(this.app, this));
		void this.updateTokenCount();
	}

	onunload() {
		if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
		this.cancelStatusBarPlacement?.();
	}

	rebuildTokenizer(): void {
		if (this.tokenizer) {
			this.tokenizer.rebuild(this.settings.model);
		} else {
			this.tokenizer = new Tokenizer(this.settings.model);
		}
	}

	private scheduleUpdate(): void {
		if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
		this.debounceTimer = window.setTimeout(() => {
			void this.updateTokenCount();
		}, DEBOUNCE_MS);
	}

	async updateTokenCount(): Promise<void> {
		if (!this.statusBarEl || !this.tokenizer) return;

		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) {
			this.statusBarEl.setText("");
			return;
		}

		const text = view.editor.getValue();
		const count = await this.tokenizer.count(text);
		const formatted = count.toLocaleString();
		const label = this.settings.showModelLabel
			? ` · ${this.settings.model}`
			: "";
		this.statusBarEl.setText(`${formatted} tokens${label}`);
	}

	async loadSettings() {
		const data = (await this.loadData()) as Partial<TokenCountSettings> & {
			model?: string;
		};
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
		if (data.model) {
			const normalized = normalizeModelId(data.model);
			if (normalized !== this.settings.model) {
				this.settings.model = normalized;
				await this.saveSettings();
			}
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
