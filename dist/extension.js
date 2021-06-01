/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");;

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModel = void 0;
const vscode = __webpack_require__(1);
const componentFiles_1 = __webpack_require__(3);
class AppModel {
    createComponentDirAndFiles() {
        if (vscode.workspace.workspaceFolders === undefined) {
            this.logError('No workspace folder is open!');
            vscode.window.showErrorMessage('No workspace folder is open. Please open VS Code at a path that contains a folder.');
        }
        else {
            const projectRoot = vscode.workspace.workspaceFolders[0].uri;
            vscode.window
                .showInputBox({
                value: '/',
                prompt: `Create New Component /path/to/Component, relative to project root`,
                ignoreFocusOut: true,
                valueSelection: [-1, -1],
            })
                .then((componentPath) => __awaiter(this, void 0, void 0, function* () {
                if (!componentPath)
                    return;
                const componentName = this.getComponentNameFromUri(componentPath);
                try {
                    const dirUri = vscode.Uri.joinPath(projectRoot, componentPath);
                    const files = new componentFiles_1.ComponentFiles(dirUri, componentName);
                    // create directory
                    yield vscode.workspace.fs.createDirectory(dirUri);
                    // create _.tsx file
                    yield vscode.workspace.fs.writeFile(files.tsxUri, files.tsxContent);
                    // create _.module.css file
                    yield vscode.workspace.fs.writeFile(files.cssUri, files.cssContent);
                    // create _.index.ts file
                    yield vscode.workspace.fs.writeFile(files.indexUri, files.indexExportContent);
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
                }
                catch (error) {
                    this.logError(error);
                    vscode.window.showErrorMessage('Somthing went wrong! Please report on GitHub');
                }
            }));
        }
    }
    logError(error) {
        console.log('==============Error===============');
        console.log(error);
        console.log('===================================');
    }
    getComponentNameFromUri(path) {
        const pathArr = path.split('/');
        return pathArr[pathArr.length - 1];
    }
}
exports.AppModel = AppModel;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentFiles = void 0;
const vscode = __webpack_require__(1);
class ComponentFiles {
    constructor(dirUri, name) {
        this.tsxUri = vscode.Uri.joinPath(dirUri, `${name}.tsx`);
        this.cssUri = vscode.Uri.joinPath(dirUri, `${name}.module.css`);
        this.indexUri = vscode.Uri.joinPath(dirUri, `index.ts`);
        this.tsxContent = this.str2uint(`import { FC } from 'react'
import s from './${name}.module.css'

const ${name}: FC = () => {
  return <div className={s.root}></div>        
}
      
export default ${name}`);
        this.cssContent = this.str2uint(`.root {
  @apply;
}`);
        this.indexExportContent = this.str2uint(`export { default as ${name} } from './${name}'`);
        this.parentExportContent = this.str2uint(`export { ${name} } from './${name}'`);
    }
    // converts string to Uint8Array
    str2uint(str) {
        var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return new Uint8Array(buf);
    }
}
exports.ComponentFiles = ComponentFiles;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __webpack_require__(1);
const appModel_1 = __webpack_require__(2);
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const appModel = new appModel_1.AppModel();
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('component-folder-structure.createComponentDir', () => {
        // The code you place here will be executed every time your command is executed
        appModel.createComponentDirAndFiles();
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from Component Folder Structure!');
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map