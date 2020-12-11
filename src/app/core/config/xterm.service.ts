import { Injectable } from '@angular/core'
import { ITheme } from 'xterm'

@Injectable({
  providedIn: 'root'
})
export class XtermService {

  WHITE: ITheme = {
    foreground: 'lightslategray',
    background: 'white',
  }

  BLACK: ITheme = {
    foreground: 'whitesmoke',
    background: '#000000',
  }

  getTheme(name: string) {
    switch (name) {
      case 'white':
        return this.WHITE
      case 'black':
        return this.BLACK
      default:
        return this.BLACK
    }
  }

  wrapRed(msg: string) {
    return `\x1b[31m${msg}\x1b[0m`
  }
  wrapGreen(msg: string) {
    return `\x1b[32m${msg}\x1b[0m`
  }
  wrapYellow(msg: string) {
    return `\x1b[33m${msg}\x1b[0m`
  }
  wrapBlue(msg: string) {
    return `\x1b[34m${msg}\x1b[0m`
  }
  wrapMagenta(msg: string) {
    return `\x1b[35m${msg}\x1b[0m`
  }
}
