import { AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FavoriteService } from 'app/api/service/favorite.service'
import { ScenarioStepType } from 'app/api/service/scenario.service'
import { ActorEvent, ActorEventType } from 'app/model/api.model'
import { NameValue } from 'app/model/common.model'
import { FavoriteTargetType, VariablesImportItem } from 'app/model/es.model'
import { Subject } from 'rxjs'
import { ITerminalOptions, ITheme, Terminal } from 'xterm'
import { fit } from 'xterm/lib/addons/fit/fit'
import { webLinksInit } from 'xterm/lib/addons/webLinks/webLinks'

@Component({
  selector: 'app-top-content',
  templateUrl: './top-content.component.html',
  styles: [`
    .item-option {
    }
    .option-title {
      border-bottom: 1px solid lightgrey;
    }
    .item-option:hover .option-title {
      font-weight: 600;
    }
    .option-content {
      max-height: 120px;
      overflow: auto;
      color: lightgrey;
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;
    }
  `]
})
export class TopContentComponent implements OnInit, AfterViewInit {

  type = ''
  title = ''
  from: NameValue[] = []
  fromValue = 0
  toValue = 0
  imports: VariablesImportItem[] = []
  url = ''
  cardBodyStyle = {
    padding: '8px'
  }
  importsCardHeight = `${Math.floor((window.innerHeight - 112) * 0.6)}px`
  importsHeight = `${Math.floor((window.innerHeight - 112) * 0.6 - 72)}px`
  toolHeight = `${Math.floor((window.innerHeight - 112) * 0.4)}px`
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
  xtermStyle = {}
  log: Subject<ActorEvent<string>> = new Subject()
  @HostListener('window:resize')
  resize() {
    this.importsCardHeight = `${Math.floor((window.innerHeight - 112) * 0.6)}px`
    this.toolHeight = `${Math.floor((window.innerHeight - 112) * 0.4)}px`
    this.importsHeight = `${Math.floor((window.innerHeight - 112) * 0.6 - 72)}px`
    this.initXtermStyle()
    fit(this.xterm)
  }

  constructor(
    private favoriteService: FavoriteService,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef<HTMLDivElement>,
  ) {
    this.initXtermStyle()
  }

  run() {
    this.xterm.clear()
    this.printlnOkMsg(`from: ${this.fromValue}`)
    this.printlnOkMsg(`to: ${this.toValue}`)
    this.printlnOkMsg(`imports: ${JSON.stringify(this.imports)}`)
  }

  initXtermStyle() {
    this.xtermStyle = {
      'width': `100%`,
      'height': `${Math.floor((window.innerHeight - 112) * 0.4) - 48}px`,
    }
  }

  fromChange() {
    if (this.toValue < this.fromValue) {
      this.toValue = this.from.length - 1
    }
  }

  goExport() {
    this.router.navigateByUrl(this.url)
  }

  loadById(group: string, project: string, id: string) {
    this.favoriteService.getToptop(group, project, id).subscribe(res => {
      const response = res.data
      const tmp: NameValue[] = []
      if (response.scenario) {
        this.type = FavoriteTargetType.TARGET_TYPE_SCENARIO
        this.title = response.scenario.summary
        this.url = `/scenario/${response.scenario.group}/${response.scenario.project}/${response.scenario._id}`
        this.imports = response.scenario.imports || []
        response.scenario.steps.forEach((step, i) => {
          switch (step.type) {
            case ScenarioStepType.CASE:
              tmp.push({ name: response.case[step.id].summary, value: i })
              break;
            case ScenarioStepType.DUBBO:
              tmp.push({ name: response.dubbo[step.id].summary, value: i })
              break;
            case ScenarioStepType.SQL:
              tmp.push({ name: response.sql[step.id].summary, value: i })
              break;
            default:
              break;
          }
        })
      } else if (response.job) {
        this.type = FavoriteTargetType.TARGET_TYPE_JOB
        this.title = response.job.summary
        this.url = `/job/${response.job.group}/${response.job.project}/${response.job._id}`
        this.imports = response.job.imports || []
        response.job.jobData.scenario.forEach((step, i) => {
          tmp.push({ name: response.scenarios[step.id].summary, value: i })
        })
      }
      this.from = [...tmp]
      this.fromValue = 0
      this.toValue = this.from.length - 1
    })
  }

  printlnOkMsg(msg: string) {
    this.xterm.writeln(`${msg}`)
  }

  printlnErrMsg(msg: string) {
    this.xterm.writeln(`💩 ${msg}`)
  }

  ngAfterViewInit(): void {
    const xtermEl = this.el.nativeElement.getElementsByClassName('xterm')[0] as HTMLElement
    this.xterm.open(xtermEl)
    fit(this.xterm)
    webLinksInit(this.xterm)
    this.log.subscribe(event => {
      if (ActorEventType.ERROR === event.type) {
        this.printlnErrMsg(event.msg)
      } else {
        this.printlnOkMsg(event.msg)
      }
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const topGroup = params['topGroup']
      const topProject = params['topProject']
      const topId = params['topId']
      if (topGroup && topProject && topId) { this.loadById(topGroup, topProject, topId) }
    })
  }
}
