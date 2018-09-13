import { Location } from '@angular/common'
import { AfterViewInit, Component, ElementRef, HostListener } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'
import { ITheme, Terminal } from 'xterm'
import { fit } from 'xterm/lib/addons/fit/fit'

@Component({
  selector: 'app-console-report',
  templateUrl: './console-report.component.html',
})
export class ConsoleReportComponent implements AfterViewInit {

  xterm = new Terminal()
  theme: ITheme = { foreground: 'white', background: '#000000a9', cursor: 'wheat' }
  style = {
    'width': `${window.innerWidth}px`,
    'height': '360px'
  }
  @HostListener('window:resize')
  resize() {
    this.style = {
      'width': `${window.innerWidth}px`,
      'height': '360px'
    }
    fit(this.xterm)
  }

  constructor(
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private el: ElementRef<HTMLDivElement>,
  ) { }

  ngAfterViewInit(): void {
    const xtermEl = this.el.nativeElement.getElementsByClassName('xterm')[0] as HTMLElement
    this.xterm.setOption('allowTransparency', true)
    this.xterm.setOption('cursorStyle', 'block')
    this.xterm.setOption('theme', this.theme)
    this.xterm.open(xtermEl)
    fit(this.xterm)
    setInterval(() => {
      this.xterm.writeln('🤔 : ' + new Date())
    }, 2000)
  }
}
