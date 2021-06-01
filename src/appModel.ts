import * as vscode from 'vscode';
import * as path from 'path';
import { ComponentFiles } from './componentFiles';

export class AppModel {
  createComponentDirAndFiles() {
    if (vscode.workspace.workspaceFolders === undefined) {
      this.logError('No workspace folder is open!');
      vscode.window.showErrorMessage(
        'No workspace folder is open. Please open VS Code at a path that contains a folder.'
      );
    } else {
      const projectRoot = vscode.workspace.workspaceFolders[0].uri;

      vscode.window
        .showInputBox({
          value: '/',
          prompt: `Create New Component /path/to/Component, relative to project root`,
          ignoreFocusOut: true,
          valueSelection: [-1, -1],
        })
        .then(async (componentPath) => {
          if (!componentPath) return;
          const componentName = this.getComponentNameFromUri(componentPath);

          try {
            const dirUri = vscode.Uri.joinPath(projectRoot, componentPath);
            const files = new ComponentFiles(dirUri, componentName);

            // create directory
            await vscode.workspace.fs.createDirectory(dirUri);

            // create _.tsx file
            await vscode.workspace.fs.writeFile(files.tsxUri, files.tsxContent);

            // create _.module.css file
            await vscode.workspace.fs.writeFile(files.cssUri, files.cssContent);

            // create _.index.ts file
            await vscode.workspace.fs.writeFile(
              files.indexUri,
              files.indexExportContent
            );

            // add parentExport to ../index.ts

            //=======================================
            // setTimeout(() => {
            //   //tiny delay
            //   if (taskType === 'file') {
            //     let openPath = paths.find((path) => fs.lstatSync(path).isFile());
            //     if (!openPath) return;
            //     vscode.workspace.openTextDocument(openPath).then((editor) => {
            //       if (!editor) return;
            //       vscode.window.showTextDocument(editor);
            //     });
            //   }
            // }, 50);
          } catch (error) {
            this.logError(error);
            vscode.window.showErrorMessage(
              'Somthing went wrong! Please report on GitHub'
            );
          }
        });
    }
  }

  logError(error: any) {
    console.log('==============Error===============');
    console.log(error);
    console.log('===================================');
  }

  getComponentNameFromUri(path: string): string {
    const pathArr = path.split('/');
    return pathArr[pathArr.length - 1];
  }
}
