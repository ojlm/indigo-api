import { Injectable } from '@angular/core'


@Injectable({
  providedIn: 'root'
})
export class MonacoService {

  DEFAULT_THEME = 'vs-dark'

  getPlainTextOption() {
    return {
      theme: this.DEFAULT_THEME,
      language: 'plaintext',
      automaticLayout: true,
      contextmenu: false
    }
  }

  getMarkdownOption() {
    return {
      theme: this.DEFAULT_THEME,
      language: 'markdown',
      automaticLayout: true,
      contextmenu: false,
      lineNumbers: 'off'
    }
  }

  getJsonOption() {
    return {
      theme: this.DEFAULT_THEME,
      language: 'json',
      automaticLayout: true,
      contextmenu: false
    }
  }

  getJavascriptOption() {
    return {
      theme: this.DEFAULT_THEME,
      language: 'javascript',
      automaticLayout: true,
      contextmenu: false
    }
  }
}
