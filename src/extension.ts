// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AppModel } from './appModel';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const appModel = new AppModel();

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'component-folder-structure.createComponentDir',
    () => {
      // The code you place here will be executed every time your command is executed
      appModel.createComponentDirAndFiles();
      // Display a message box to the user
      vscode.window.showInformationMessage(
        'Hello World from Component Folder Structure!'
      );
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
