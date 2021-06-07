import * as vscode from 'vscode';

export class ComponentFiles {
  readonly tsxUri: vscode.Uri;
  readonly cssUri: vscode.Uri;
  readonly indexUri: vscode.Uri;

  readonly tsxContent: Uint8Array;
  readonly cssContent: Uint8Array;
  readonly indexExportContent: Uint8Array;
  readonly parentExportContent: Uint8Array;

  constructor(dirUri: vscode.Uri, name: string) {
    this.tsxUri = vscode.Uri.joinPath(dirUri, `${name}.tsx`);
    this.cssUri = vscode.Uri.joinPath(dirUri, `${name}.module.css`);
    this.indexUri = vscode.Uri.joinPath(dirUri, `index.ts`);

    this.tsxContent = this.str2uint(`import { FC } from 'react'
import s from './${name}.module.css'

const ${name}: FC =  () => {
  return <div className={s.root}></div>        
}
      
export default ${name}`);

    this.cssContent = this.str2uint(`.root {
  @apply;
}`);

    this.indexExportContent = this.str2uint(
      `export { default as ${name} } from './${name}'`
    );

    this.parentExportContent = this.str2uint(
      `export { ${name} } from './${name}'`
    );
  }

  public createFile() {}

  public injectContent() {}

  // converts string to Uint8Array
  private str2uint(str: string): Uint8Array {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return new Uint8Array(buf);
  }
}
