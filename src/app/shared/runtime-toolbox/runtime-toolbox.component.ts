import { AfterViewInit, Component, ElementRef, Input } from '@angular/core'
import { StepStatusData } from 'app/api/service/scenario.service'
import { ScenarioStepData } from 'app/routes/scenario/select-step/select-step.component'
import { Subject } from 'rxjs'
import { ITerminalOptions, ITheme, Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'

import { ActorEvent, ActorEventType } from '../../model/api.model'
import { JobExecDesc, ReportItemEvent, ScenarioStep } from '../../model/es.model'

@Component({
  selector: 'app-runtime-toolbox',
  templateUrl: './runtime-toolbox.component.html',
})
export class RuntimeToolboxComponent implements AfterViewInit {

  desc = ''
  tabIndex = 0
  nzTabBarStyle = {
    margin: '4px'
  }
  theme: ITheme = {
    foreground: 'lightslategray',
    background: 'white',
  }
  option: ITerminalOptions = {
    theme: this.theme,
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
  totalHeight = 360
  contentHeight = `${this.totalHeight - 52}px`

  stepCurrent = 0
  subject: Subject<any> = new Subject()
  @Input() steps: ScenarioStep[] = []
  @Input() stepsDataCache: { [k: string]: ScenarioStepData } = {}
  @Input() stepsStatusCache: { [k: number]: StepStatusData } = {}

  @Input()
  set height(val: number) {
    if (val) {
      this.totalHeight = val
      this.resize()
    }
  }
  @Input() log: Subject<ActorEvent<JobExecDesc & ReportItemEvent>>
  @Input() command: Subject<string>

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
    this.contentHeight = `${this.totalHeight - 56}px`
    this.xtermStyle = {
      'width': '100%',
      'height': this.contentHeight,
    }
  }

  clearStatus() {
    for (let i = 0; i < this.steps.length; ++i) {
      this.stepsStatusCache[i] = {}
    }
    this.updateStepRuntimeData()
  }

  updateStepRuntimeData() {
    this.stepsDataCache = { ...this.stepsDataCache }
    this.stepsStatusCache = { ...this.stepsStatusCache }
    this.subject.next()
  }

  ngAfterViewInit(): void {
    const xtermEl = this.el.nativeElement.getElementsByClassName('xterm')[0] as HTMLElement
    this.xterm.open(xtermEl)
    this.xterm.loadAddon(this.fitAddon)
    this.xterm.loadAddon(this.webAddon)
    this.fitAddon.fit()
    if (this.log) {
      this.log.subscribe(event => {
        if (ActorEventType.ITEM === event.type) {
          const reportItem = event.data
          this.stepCurrent = reportItem.index
          if (0 === this.stepCurrent) {
            this.clearStatus()
          }
          const statusData: StepStatusData = {}
          statusData.report = reportItem
          if ('pass' === reportItem.status) {
            statusData.status = 'success'
          } else if ('fail' === reportItem.status) {
            statusData.status = 'error'
          } else if ('skipped' === reportItem.status) {
            statusData.status = 'warning'
          } else {
            statusData.status = 'default'
          }
          this.stepsStatusCache[reportItem.index] = statusData
          this.updateStepRuntimeData()
        } else if (ActorEventType.OVER === event.type) {
          let renderedDescription = event.data['renderedDescription'] // scenario
          if (!renderedDescription && event.data.report && event.data.report.data && event.data.report.data.renderedDescription) {
            renderedDescription = event.data.report.data.renderedDescription // job
          }
          this.desc = renderedDescription
          this.tabIndex = 1
        } else {
          if (ActorEventType.ERROR === event.type) {
            this.printlnErrMsg(event.msg)
          } else {
            this.printlnOkMsg(event.msg)
          }
        }
      })
    } else {
      this.xterm.writeln(`🤔 : no log subject injected`)
    }
    if (this.command) {
      this.command.subscribe(cmd => {
        switch (cmd) {
          case 'reset':
            this.desc = ''
            this.xterm.clear()
            this.tabIndex = 0
            break
        }
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
