import { App, PluginSettingTab, Setting } from "obsidian";
import type TokenCountPlugin from "./main";

export type ModelId = "gpt-5" | "gpt-4o" | "gpt-4";

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
			.setDesc("Tokenizer for the selected OpenAI model (via gpt-tokenizer).")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("gpt-5", "gpt-5")
					.addOption("gpt-4o", "gpt-4o")
					.addOption("gpt-4", "gpt-4")
					.setValue(this.plugin.settings.model)
					.onChange(async (value) => {
						this.plugin.settings.model = value as ModelId;
						await this.plugin.saveSettings();
						this.plugin.rebuildTokenizer();
						this.plugin.updateTokenCount();
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
						this.plugin.updateTokenCount();
					}),
			);
	}
}
