import { IpcRenderer } from "electron";

import { NativeHooks, WindowType } from "./types";

class NativeHooksImplementation implements NativeHooks {
	ipcRenderer: IpcRenderer;

	constructor(ipcRenderer: IpcRenderer) {
		this.ipcRenderer = ipcRenderer;
	}
	async openFile() {
		const { filePaths, canceled } = await this.ipcRenderer.invoke("openFile");
		if (!canceled) {
			return filePaths[0];
		}
	}
	async openFolder() {
		const { filePaths, canceled } = await this.ipcRenderer.invoke("openFolder");
		if (!canceled) {
			return filePaths[0];
		}
	}
	async changeWindowSize(windowType: WindowType) {
		await this.ipcRenderer.invoke("changeWindowSize", windowType);
	}
	async openCommunityLink() {
		await this.ipcRenderer.invoke("openCommunityLink");
	}
	async openHelpLink() {
		await this.ipcRenderer.invoke("openHelpLink");
	}
	async openUsageLink() {
		await this.ipcRenderer.invoke("openUsageLink");
	}
	async openCustomLink(link?: string) {
		await this.ipcRenderer.invoke("openCustomLink", link);
	}
}

export default NativeHooksImplementation;
