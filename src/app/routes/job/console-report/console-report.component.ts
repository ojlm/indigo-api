import { Location } from '@angular/common'
import { AfterViewInit, Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'
import { Terminal } from 'xterm'

// import { fit } from 'xterm/lib/addons/fit/fit'

@Component({
  selector: 'app-console-report',
  templateUrl: './console-report.component.html',
})
export class ConsoleReportComponent implements AfterViewInit {

  xterm = new Terminal()

  constructor(
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private el: ElementRef<HTMLDivElement>,
  ) { }

  ngAfterViewInit(): void {
    const xtermEl = this.el.nativeElement.getElementsByClassName('xterm')[0] as HTMLElement
    this.xterm.open(xtermEl)
    // fit(this.xterm)
    this.xterm.writeln('hello world!')
  }
}
