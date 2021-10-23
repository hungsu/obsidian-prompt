import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, Vault, TFile, addIcon } from 'obsidian';

import { FileSuggest, FileSuggestMode } from "FileSuggester";

interface PromptPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: PromptPluginSettings = {
	mySetting: 'Prompts.md'
}

export default class PromptPlugin extends Plugin {
	settings: PromptPluginSettings;

	showRandomPrompt = () => {
		const fileOrFolder = this.app.vault.getAbstractFileByPath(this.settings.mySetting)

		if (fileOrFolder instanceof TFile) {
			this.app.vault.read(fileOrFolder).then(
				fileContents => {
					const prompts = fileContents.split('\n').filter(potentialPrompt => {
						let promptIsNotAComment = potentialPrompt.indexOf('%%') == -1
						return promptIsNotAComment && potentialPrompt.trim().length > 0
					})
					const chosenPromptIndex = Math.floor(Math.random() * prompts.length)
					new Notice(prompts[chosenPromptIndex]);
				}
			)

		} else {
			// fileOrFolder is null or a TFolder... handle accordingly
			// new Notice('Not found!');
		}
	}

	async onload() {
		await this.loadSettings();

		addIcon('diceQuestion', '<path fill="currentColor" stroke="currentColor" d="m49.953 8.7422c-1.207 0-2.4141 0.26953-3.3477 0.8125l-29.836 17.258c-1.8672 1.082-1.8672 2.7891 0 3.8711l29.836 17.258c1.8711 1.082 4.8242 1.082 6.6953 0l29.832-17.258c1.8711-1.082 1.8711-2.7891 0-3.8711l-29.832-17.258c-0.9375-0.54297-2.1406-0.8125-3.3477-0.8125zm-0.16016 10.375c1.7578 0.019531 3.3438 0.42187 4.7461 1.207 0.96094 0.53906 1.5898 1.1523 1.8906 1.8438 0.28516 0.6875 0.30469 1.5898 0.050781 2.707l-0.3125 1.1172c-0.20703 0.79687-0.25 1.3711-0.12891 1.7188 0.10938 0.34375 0.38672 0.64062 0.82813 0.88672l0.66016 0.37109-6.4922 3.6367-0.71875-0.40234c-0.80469-0.44922-1.3164-0.96094-1.5391-1.5273-0.23438-0.57422-0.19531-1.4844 0.11328-2.7344l0.30078-1.125c0.17188-0.66797 0.1875-1.2148 0.050782-1.6445-0.12891-0.43359-0.41797-0.77734-0.87109-1.0273-0.68359-0.38672-1.5078-0.52344-2.4648-0.41797-0.96875 0.10547-1.9688 0.44531-3 1.0234-0.96875 0.54297-1.8516 1.2227-2.6445 2.043-0.80469 0.8125-1.4922 1.7422-2.0703 2.7891l-4.6172-2.5898c1.0391-1.043 2.0586-1.9531 3.0625-2.7344 1-0.78125 2.0586-1.4844 3.1758-2.1094 2.9258-1.6406 5.6445-2.6133 8.1602-2.9258 0.625-0.078125 1.2344-0.11328 1.8203-0.10547zm9.9141 11.074 5.2344 2.9336-6.4883 3.6367-5.2383-2.9336zm-44.93 3.7617c-1.1211-0.03125-1.8867 0.84766-1.8867 2.3984v30.801c0 2.1562 1.4805 4.7188 3.3477 5.7969l28.699 16.574c1.8672 1.0781 3.3477 0.22656 3.3477-1.9336v-30.801c0-2.1602-1.4805-4.7188-3.3477-5.7969l-28.699-16.574c-0.52344-0.30078-1.0195-0.45312-1.457-0.46484zm70.465 0c-0.4375 0.011719-0.93359 0.16406-1.4609 0.46484l-28.695 16.574c-1.8711 1.0781-3.3477 3.6406-3.3477 5.7969v30.801c0 2.1602 1.4766 3.0117 3.3477 1.9336l28.695-16.57c1.8711-1.082 3.3477-3.6406 3.3477-5.8008v-30.801c0-1.5508-0.76172-2.4258-1.8867-2.3984zm-62.801 12.453c1.2812 0.26562 2.4492 0.59375 3.5078 0.97656 1.0547 0.38672 2.0781 0.86328 3.0625 1.4336 2.5781 1.4883 4.5469 3.1875 5.8984 5.0938 1.3555 1.8945 2.0312 3.9141 2.0312 6.0625 0 1.1016-0.20312 1.9688-0.61719 2.6094-0.41406 0.62891-1.1172 1.1523-2.1094 1.582l-1.0156 0.375c-0.71875 0.28125-1.1914 0.57031-1.4141 0.87109-0.22266 0.28516-0.33203 0.68359-0.33203 1.1875v0.75781l-5.7266-3.3047v-0.82812c0-0.92188 0.17188-1.6367 0.52344-2.1406 0.34766-0.51953 1.082-1.0039 2.2031-1.4609l1.0156-0.39062c0.60547-0.23438 1.043-0.53125 1.3164-0.89062 0.28516-0.35156 0.42969-0.78906 0.42969-1.3047 0-0.78516-0.25391-1.5469-0.76172-2.2773-0.50781-0.74219-1.2148-1.3789-2.125-1.9023-0.85938-0.49609-1.7812-0.83984-2.7773-1.0312-0.99609-0.20312-2.0312-0.24219-3.1094-0.125zm52.645 1.6797c0.29687 0 0.57031 0.03125 0.82812 0.097656 1.3516 0.33203 2.0273 1.5703 2.0273 3.7148 0 1.1016-0.20312 2.2109-0.61719 3.3281-0.41406 1.1016-1.1172 2.4414-2.1094 4.0156l-1.0156 1.5469c-0.71875 1.1133-1.1914 1.9453-1.4141 2.5-0.22266 0.54688-0.33203 1.0703-0.33203 1.5781v0.75781l-5.7266 3.3047v-0.82422c0-0.92188 0.17578-1.8398 0.52344-2.7461 0.34766-0.92188 1.082-2.2578 2.2031-4.0078l1.0156-1.5625c0.60547-0.93359 1.043-1.7383 1.3203-2.4141 0.28516-0.67969 0.42578-1.2812 0.42578-1.7969 0-0.78906-0.25391-1.2539-0.76172-1.3984-0.50781-0.15625-1.2148 0.027343-2.125 0.55078-0.85547 0.49609-1.7812 1.2227-2.7773 2.1797-0.99219 0.94531-2.0312 2.0977-3.1094 3.4648v-5.2969c1.2812-1.2109 2.4492-2.2344 3.5078-3.0703 1.0547-0.83594 2.0781-1.5352 3.0625-2.1055 2.0938-1.2109 3.7852-1.8164 5.0742-1.8164zm-49.359 18.461 5.7266 3.3047v6.0039l-5.7266-3.3047zm46.727 1.5742v6.0039l-5.7266 3.3047v-6.0039z"/>')

		this.addRibbonIcon('diceQuestion', 'Show a random prompt', this.showRandomPrompt);

		this.addCommand({
			id: 'prompt-random',
			name: 'Show a random prompt',
			// callback: () => {
			// 	console.log('Simple Callback');
			// },
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						this.showRandomPrompt()
					}
					return true;
				}
				return false;
			}
		});

		this.addSettingTab(new PromptPluginSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class PromptPluginSettingTab extends PluginSettingTab {
	plugin: PromptPlugin;

	constructor(app: App, plugin: PromptPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Obsidian Prompt settings'});
		containerEl.createEl('p', {text: 'Show yourself a random bit of inspiration when you need it! Remember you can trigger a prompt with the Command Palette, or a Hotkey.'});

		new Setting(containerEl)
			.setName('File with prompts')
			.setDesc('A file with one Prompt per line. Comments and Blank lines will automatically be ignored.')
			.addSearch(cb => {

				new FileSuggest(
					this.app,
					cb.inputEl,
					this.plugin,
					FileSuggestMode.TemplateFiles
				);
				cb
					.setPlaceholder('Path to your prompts file')
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			})
	}
}
