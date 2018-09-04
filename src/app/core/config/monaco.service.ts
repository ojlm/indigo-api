import { Injectable } from '@angular/core'


@Injectable({
  providedIn: 'root'
})
export class MonacoService {

  DEFAULT_THEME = 'vs-dark'

  getPlainTextOption(readOnly = false) {
    return {
      theme: this.DEFAULT_THEME,
      language: 'plaintext',
      automaticLayout: true,
      contextmenu: false,
      readOnly: readOnly
    }
  }

  getMarkdownOption(readOnly = false) {
    return {
      theme: this.DEFAULT_THEME,
      language: 'markdown',
      automaticLayout: true,
      contextmenu: false,
      lineNumbers: 'off',
      readOnly: readOnly
    }
  }

  getJsonOption(readOnly = false) {
    return {
      theme: this.DEFAULT_THEME,
      language: 'json',
      automaticLayout: true,
      contextmenu: false,
      readOnly: readOnly
    }
  }

  getJavascriptOption(readOnly = false) {
    return {
      theme: this.DEFAULT_THEME,
      language: 'javascript',
      automaticLayout: true,
      contextmenu: false,
      readOnly: readOnly
    }
  }
}
