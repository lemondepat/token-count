import { App, PluginSettingTab, Setting } from "obsidian";
import type TokenCountPlugin from "./main";

export type ModelId =
	| "gpt-5"
	| "gpt-4o"
	| "gpt-4"
	| "claude"
	| "gemini";

const LEGACY_GEMINI_MODELS = new Set([
	"gemini-2.5-flash",
	"gemini-3.5-flash",
]);

/** Migrate saved settings from older Gemini-specific model ids. */
export function normalizeModelId(model: string): ModelId {
	if (LEGACY_GEMINI_MODELS.has(model)) return "gemini";
	return model as ModelId;
}

export interface TokenCountSettings {
	model: ModelId;
	showModelLabel: boolean;
}

export const DEFAULT_SETTINGS: TokenCountSettings = {
	model: "gpt-5",
	showModelLabel: true,
};

export class TokenCountSettingTab extends PluginSettingTab {
	plugin: TokenCountPlugin;

	constructor(app: App, plugin: TokenCountPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Model")
			.setDesc("Count tokens as the selected model would for API usage.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("gpt-5", "gpt-5")
					.addOption("gpt-4o", "gpt-4o")
					.addOption("gpt-4", "gpt-4")
					.addOption("claude", "claude")
					.addOption("gemini", "gemini")
					.setValue(this.plugin.settings.model)
					.onChange(async (value) => {
						this.plugin.settings.model = value as ModelId;
						await this.plugin.saveSettings();
						this.plugin.rebuildTokenizer();
						void this.plugin.updateTokenCount();
					}),
			);

		new Setting(containerEl)
			.setName("Show model in status bar")
			.setDesc("Display the model id after the token count (e.g. · gpt-5).")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showModelLabel)
					.onChange(async (value) => {
						this.plugin.settings.showModelLabel = value;
						await this.plugin.saveSettings();
						void this.plugin.updateTokenCount();
					}),
			);
	}
}
