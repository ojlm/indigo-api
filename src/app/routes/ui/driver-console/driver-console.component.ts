import { AfterViewInit, Component, ElementRef, Input } from '@angular/core'
import { XtermService } from '@core/config/xterm.service'
import { Subject } from 'rxjs'
import { ITerminalOptions, Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'

@Component({
  selector: 'app-driver-console',
  templateUrl: './driver-console.component.html',
})
export class DriverConsoleComponent implements AfterViewInit {

  option: ITerminalOptions = {
    theme: this.xtermService.BLACK,
    allowTransparency: true,
    cursorBlink: false,
    cursorStyle: 'block',
    fontFamily: 'monospace',
    fontSize: 12,
    disableStdin: true,
  }
  xterm = new Terminal(this.option)
  fitAddon = new FitAddon()
  webAddon = new WebLinksAddon()
  xtermStyle = {}

  _height = ''
  subject: Subject<any> = new Subject()

  @Input() set height(val: string) {
    if (val) {
      this._height = val
      this.resize()
    }
  }
  @Input() set theme(val: string) {
    this.option.theme = this.xtermService.getTheme(val)
  }
  @Input() log: Subject<string>

  resize() {
    this.initStyle()
    this.fitAddon.fit()
  }

  constructor(
    private el: ElementRef<HTMLDivElement>,
    private xtermService: XtermService,
  ) {
    this.initStyle()
  }

  initStyle() {
    this.xtermStyle = {
      'width': '100%',
      'height': this._height,
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
        this.printlnOkMsg(event)
      })
    }
  }

  printlnOkMsg(msg: string) {
    this.xterm.writeln(`${msg}`)
  }

  printlnErrMsg(msg: string) {
    this.xterm.writeln(`💩 ${msg}`)
  }

}
