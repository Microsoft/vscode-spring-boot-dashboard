// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

'use strict';
import * as vscode from 'vscode';
import { LocalAppTreeProvider } from './LocalAppTree';
import { BootAppManager } from './BootAppManager';
import { BootApp } from './BootApp';
import { Controller } from './Controller';

let localAppManager: BootAppManager;

export function activate(context: vscode.ExtensionContext) {
    localAppManager = new BootAppManager();
    const localTree: LocalAppTreeProvider = new LocalAppTreeProvider(context, localAppManager);
    const controller: Controller = new Controller(localAppManager);

    context.subscriptions.push(vscode.window.registerTreeDataProvider('spring-boot-dashboard', localTree));
    context.subscriptions.push(vscode.commands.registerCommand("spring-boot-dashboard.refresh", () => {
        localAppManager.fireDidChangeApps();
    }));
    context.subscriptions.push(vscode.commands.registerCommand("spring-boot-dashboard.localapp.start", (app: BootApp) => {
        controller.startBootApp(app);
    }));
    context.subscriptions.push(vscode.commands.registerCommand("spring-boot-dashboard.localapp.debug", (app: BootApp) => {
        controller.startBootApp(app, true);
    }));
    context.subscriptions.push(vscode.commands.registerCommand("spring-boot-dashboard.localapp.stop", (app: BootApp) => {
        controller.stopBootApp(app);
    }));
    context.subscriptions.push(vscode.commands.registerCommand("spring-boot-dashboard.localapp.open", (app: BootApp) => {
        controller.openBootApp(app);
    }));
    vscode.debug.onDidStartDebugSession((session: vscode.DebugSession) => {
        if (session.type === "java") {
            controller.onDidStartBootApp(session);
        }
    });
    vscode.debug.onDidTerminateDebugSession((session: vscode.DebugSession) => {
        if (session.type === "java") {
            controller.onDidStopBootApp(session);
        }
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}
