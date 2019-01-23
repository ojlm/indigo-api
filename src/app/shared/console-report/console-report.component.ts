import { Location } from '@angular/common'
import { AfterViewInit, Component, ElementRef, HostListener, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'
import { ITerminalOptions, ITheme, Terminal } from 'xterm'
import { fit } from 'xterm/lib/addons/fit/fit'
import { webLinksInit } from 'xterm/lib/addons/webLinks/webLinks'

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
    background: '#000000a9',
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
  style = {}
  @Input() log: Subject<ActorEvent<JobExecDesc | string>>
  @Input() newline = true
  @Input() echo = false
  @Input() echoLog: Subject<string>

  @HostListener('window:resize')
  resize() {
    this.initStyle()
    fit(this.xterm)
  }

  constructor(
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private el: ElementRef<HTMLDivElement>,
  ) {
    this.initStyle()
  }

  initStyle() {
    this.style = {
      'position': 'relative',
      'width': `${window.innerWidth}px`,
      'height': `${Math.round(window.innerHeight * 0.5)}px`,
      'top': '0px',
      'left': '0px'
    }
  }

  ngAfterViewInit(): void {
    const xtermEl = this.el.nativeElement.getElementsByClassName('xterm')[0] as HTMLElement
    this.xterm.open(xtermEl)
    fit(this.xterm)
    webLinksInit(this.xterm)
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
      this.xterm.on('key', (key, ev) => {
        const printable = !ev.altKey && !ev['altGraphKey'] && !ev.ctrlKey && !ev.metaKey
        if (ev.keyCode === 13) {
          this.xterm.write('\r\n')
          if (this.echoLog) {
            this.echoLog.next(this.line.join(''))
          }
          this.line = []
        } else if (ev.keyCode === 8) {
          this.line = this.line.slice(0, -1)
          this.xterm.write('\b \b')
        } else if (printable) {
          this.line.push(key)
          this.xterm.write(key)
        }
      })
      this.xterm.on('paste', (data: string) => {
        for (let i = 0; i < data.length; ++i) {
          this.line.push(data[i])
        }
        this.xterm.write(data)
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
