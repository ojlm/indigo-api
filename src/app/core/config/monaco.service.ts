import { Injectable } from '@angular/core'


@Injectable({
  providedIn: 'root'
})
export class MonacoService {

  THEME_WHITE = 'vs'
  THEME_BLACK = 'vs-dark'

  getPlainTextOption(readOnly = false) {
    return {
      theme: this.THEME_BLACK,
      language: 'plaintext',
      automaticLayout: true,
      contextmenu: false,
      readOnly: readOnly
    }
  }

  getMarkdownOption(readOnly = false) {
    return {
      theme: this.THEME_BLACK,
      language: 'markdown',
      automaticLayout: true,
      contextmenu: false,
      lineNumbers: 'off',
      readOnly: readOnly
    }
  }

  getJsonOption(readOnly = false): any {
    return {
      theme: this.THEME_BLACK,
      language: 'json',
      automaticLayout: true,
      contextmenu: false,
      readOnly: readOnly
    }
  }

  getJavascriptOption(readOnly = false): any {
    return {
      theme: this.THEME_BLACK,
      language: 'javascript',
      automaticLayout: true,
      contextmenu: false,
      readOnly: readOnly
    }
  }

  getHtmlOption(readOnly = false) {
    return {
      theme: this.THEME_BLACK,
      language: 'html',
      automaticLayout: true,
      contextmenu: false,
      readOnly: readOnly
    }
  }
}
