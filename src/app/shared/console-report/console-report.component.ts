import { AfterViewInit, Component, ElementRef, HostListener, Input } from '@angular/core'
import { Subject } from 'rxjs'
import { ITerminalOptions, ITheme, Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'

import { ActorEvent, ActorEventType } from '../../model/api.model'
import { JobExecDesc } from '../../model/es.model'

@Component({
  selector: 'app-console-report',
  templateUrl: './console-report.component.html',
  styles: [`
    .tool-icon {
      cursor: pointer;
      position: absolute;
      right: 20px;
      top: 5px;
      font-size: larger;
      color: wheat;
      z-index: 4;
    }
    .tool-icon:hover {
      font-size: large;
    }
  `]
})
export class ConsoleReportComponent implements AfterViewInit {

  line = []
  theme: ITheme = {
    foreground: 'white',
    // background: '#000000a9',
    background: '#000000',
    cursor: 'wheat',
  }
  option: ITerminalOptions = {
    theme: this.theme,
    allowTransparency: true,
    cursorBlink: true,
    cursorStyle: 'block',
    fontFamily: 'monospace',
    disableStdin: true,
  }
  xterm = new Terminal(this.option)
  fitAddon = new FitAddon()
  webAddon = new WebLinksAddon()
  style = {}
  @Input() log: Subject<ActorEvent<JobExecDesc | string>>
  @Input() newline = true
  @Input() echo = false
  @Input() echoLog: Subject<string>

  @HostListener('window:resize')
  resize() {
    this.initStyle()
    this.fitAddon.fit()
  }

  constructor(
    private el: ElementRef<HTMLDivElement>,
  ) {
    this.initStyle()
  }

  initStyle() {
    this.style = {
      'position': 'absolute',
      'width': `${window.innerWidth}px`,
      'height': `${Math.round(window.innerHeight * 0.5)}px`,
      'top': '0px',
      'left': '0px'
    }
  }

  ngAfterViewInit(): void {
    const xtermEl = this.el.nativeElement.getElementsByClassName('xterm')[0] as HTMLElement
    this.xterm.open(xtermEl)
    this.xterm.loadAddon(this.fitAddon)
    this.xterm.loadAddon(this.webAddon)
    this.fitAddon.fit()
    if (this.log) {
      this.log.subscribe(event => {
        if (ActorEventType.ERROR === event.type) {
          this.printlnErrMsg(event.msg)
        } else {
          this.printlnOkMsg(event.msg)
        }
      })
    } else {
      this.xterm.writeln(`🤔 : no log subject injected`)
    }
    if (this.echo) {
      this.xterm.onKey(e => {
        const printable = !e.domEvent.altKey && !e.domEvent['altGraphKey'] && !e.domEvent.ctrlKey && !e.domEvent.metaKey
        if (e.domEvent.keyCode === 13) {
          this.xterm.write('\r\n')
          if (this.echoLog) {
            this.echoLog.next(this.line.join(''))
          }
          this.line = []
        } else if (e.domEvent.keyCode === 8) {
          this.line = this.line.slice(0, -1)
          this.xterm.write('\b \b')
        } else if (printable) {
          this.line.push(e.key)
          this.xterm.write(e.key)
        }
      })
      this.xterm.onData(data => {
        for (let i = 0; i < data.length; ++i) {
          this.line.push(data[i])
        }
        this.xterm.paste(data)
      })
    }
  }

  clear() {
    this.xterm.clear()
  }

  printlnOkMsg(msg: string) {
    if (this.newline) {
      this.xterm.writeln(`${msg}`)
    } else {
      this.xterm.write(`${msg}`)
    }
  }

  printlnErrMsg(msg: string) {
    if (this.newline) {
      this.xterm.writeln(`💩 ${msg}`)
    } else {
      this.xterm.write(`💩 ${msg}`)
    }
  }
}
