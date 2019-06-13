import { AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18NService } from '@core'
import { I18nKey } from '@core/i18n/i18n.message'
import { formatImportsToSave } from '@shared/variables-import-table/variables-import-table.component'
import { FavoriteService } from 'app/api/service/favorite.service'
import { JobService } from 'app/api/service/job.service'
import { ScenarioService, ScenarioStepType } from 'app/api/service/scenario.service'
import { ActorEvent, ActorEventType } from 'app/model/api.model'
import { NameValue } from 'app/model/common.model'
import {
  FavoriteTargetType,
  Job,
  JobTestMessage,
  Scenario,
  ScenarioTestWebMessage,
  VariablesImportItem,
} from 'app/model/es.model'
import { NzMessageService } from 'ng-zorro-antd'
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

  group = ''
  project = ''
  KEY_ENVIRONMENT = 'Environment'
  type = ''
  _scenaro: Scenario
  _job: Job
  title = ''
  from: NameValue[] = []
  fromValue = 0
  toValue = 0
  envImport: VariablesImportItem
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
  testWs: WebSocket
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
    private scenarioService: ScenarioService,
    private jobService: JobService,
    private msgService: NzMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef<HTMLDivElement>,
    private i18nService: I18NService,
  ) {
    this.initXtermStyle()
    this.KEY_ENVIRONMENT = this.i18nService.fanyi(I18nKey.KeyEnvironment)
  }

  buildTestMessage() {
    if (FavoriteTargetType.TARGET_TYPE_SCENARIO === this.type) {
      const msg: ScenarioTestWebMessage = {
        summary: this._scenaro.summary,
        steps: this._scenaro.steps,
        imports: formatImportsToSave(this._scenaro.imports),
        controller: {
          from: this.fromValue,
          to: this.toValue,
          enableLog: true,
          enableReport: false
        }
      }
      return msg
    } else if (FavoriteTargetType.TARGET_TYPE_JOB === this.type) {
      const msg: JobTestMessage = {
        jobId: this._job._id,
        jobMeta: {
          group: this._job.group,
          project: this._job.project,
          summary: this._job.summary,
          env: this._job.env,
          description: this._job.description,
          scheduler: this._job.scheduler,
          classAlias: this._job.classAlias
        },
        jobData: this._job.jobData,
        imports: formatImportsToSave(this._job.imports),
        controller: {
          from: this.fromValue,
          to: this.toValue,
          enableLog: true,
          enableReport: false
        }
      }
      return msg
    }
  }

  run() {
    this.xterm.clear()
    this.printlnOkMsg('')
    if (this.testWs) {
      this.testWs.close()
      this.testWs = null
    }
    if (FavoriteTargetType.TARGET_TYPE_SCENARIO === this.type) {
      this.testWs = this.scenarioService.newTestWs(this.group, this.project, this._scenaro._id)
    } else if (FavoriteTargetType.TARGET_TYPE_JOB === this.type) {
      this.testWs = this.jobService.newTestWs(this.group, this.project, this._job._id)
    }
    if (this.testWs) {
      this.testWs.onopen = (event) => {
        this.testWs.send(JSON.stringify(this.buildTestMessage()))
      }
      this.testWs.onmessage = (event) => {
        if (event.data) {
          try {
            const res = JSON.parse(event.data) as ActorEvent<string>
            if (ActorEventType.ITEM === res.type) {
            } else if (ActorEventType.OVER === res.type) {
            } else {
              this.log.next(res)
            }
          } catch (error) {
            this.msgService.error(error)
            this.testWs.close()
          }
        }
      }
    }
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

  toChange() {
    if (this.fromValue > this.toValue) {
      this.fromValue = 0
    }
  }

  goExport() {
    this.router.navigateByUrl(this.url)
  }

  reset() {
    this.xterm.clear()
    this.title = ''
    this.envImport = undefined
    this.imports = []
    this.fromValue = 0
    this.toValue = 0
  }

  loadById(group: string, project: string, id: string) {
    this.reset()
    this.favoriteService.getToptop(group, project, id).subscribe(res => {
      const response = res.data
      const tmp: NameValue[] = []
      if (response.scenario) {
        this.type = FavoriteTargetType.TARGET_TYPE_SCENARIO
        this.title = response.scenario.summary
        this._scenaro = response.scenario
        this.url = `/scenario/${response.scenario.group}/${response.scenario.project}/${response.scenario._id}`
        this.imports = this.filterImports(response.scenario.imports)
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
        this._job = response.job
        this._job._id = response.jobId
        this.url = `/job/${response.job.group}/${response.job.project}/${response.jobId}`
        this.imports = this.filterImports(response.job.imports)
        response.job.jobData.scenario.forEach((step, i) => {
          tmp.push({ name: response.scenarios[step.id].summary, value: i })
        })
      }
      this.from = [...tmp]
      this.fromValue = 0
      this.toValue = this.from.length - 1
    })
  }

  filterImports(imports: VariablesImportItem[]) {
    if (imports) {
      return imports.filter(item => {
        if (this.KEY_ENVIRONMENT === item.description && !this.envImport) {
          this.envImport = item
          return false
        } else {
          return item.exposed
        }
      })
    } else {
      return []
    }
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
      this.group = params['topGroup']
      this.project = params['topProject']
      const topId = params['topId']
      if (this.group && this.project && topId) { this.loadById(this.group, this.project, topId) }
    })
  }
}
