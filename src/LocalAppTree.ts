// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";
import { BootApp } from "./BootApp";
import { BootAppManager } from "./BootAppManager";

class BootAppItem implements vscode.TreeItem {
    public readonly _app: BootApp;

    constructor(app: BootApp) {
        this._app = app;
    }

    public get label(): string {
        return this._app.name;
    }

    public get iconPath(): string | vscode.ThemeIcon {
        const color = this.state === "running" ? new vscode.ThemeColor("charts.green") : undefined;
        return new vscode.ThemeIcon("circle-filled", color);
    }

    public get state(): string {
        return this._app.state;
    }

    public get contextValue(): string {
        return `BootApp_${this._app.state}`;
    }
}

export class LocalAppTreeProvider implements vscode.TreeDataProvider<BootApp> {

    private _manager: BootAppManager;
    public readonly onDidChangeTreeData: vscode.Event<BootApp | undefined>;

    constructor(manager: BootAppManager) {
        this._manager = manager;
        this.onDidChangeTreeData = this._manager.onDidChangeApps;
        this._manager.fireDidChangeApps();
    }

    getTreeItem(element: BootApp): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return new BootAppItem(element);
    }
    getChildren(element?: BootApp | undefined): vscode.ProviderResult<BootApp[]> {
        if (!element) {
            return this._manager.getAppList();
        } else {
            return [];
        }
    }


}
