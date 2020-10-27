import { AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18NService } from '@core'
import { I18nKey } from '@core/i18n/i18n.message'
import { formatImportsToSave } from '@shared/variables-import-table/variables-import-table.component'
import { FavoriteService } from 'app/api/service/favorite.service'
import { isJobScenarioStep, JobService } from 'app/api/service/job.service'
import { ScenarioService, ScenarioStepType, StepStatusData } from 'app/api/service/scenario.service'
import { ActorEvent } from 'app/model/api.model'
import { NameValue } from 'app/model/common.model'
import {
  FavoriteTargetType,
  Job,
  JobTestMessage,
  Scenario,
  ScenarioStep,
  ScenarioTestWebMessage,
  VariablesImportItem,
} from 'app/model/es.model'
import { ScenarioStepData } from 'app/routes/scenario/select-step/select-step.component'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-top-content',
  templateUrl: './top-content.component.html',
  styleUrls: ['./top-content.component.css'],
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
  comment = ''
  importsCardHeight = `${Math.floor((window.innerHeight - 112) * 0.4)}px`
  importsHeight = `${Math.floor((window.innerHeight - 112) * 0.4 - 72)}px`
  toolHeight = `${Math.floor((window.innerHeight - 112) * 0.6)}px`
  runtimeToolboxHeight = Math.floor((window.innerHeight - 112) * 0.6) - 36
  testWs: WebSocket
  log: Subject<ActorEvent<any>> = new Subject()
  command: Subject<string> = new Subject()
  steps: ScenarioStep[] = []
  stepsDataCache: { [k: string]: ScenarioStepData } = {}
  stepsStatusCache: { [k: number]: StepStatusData } = {}
  stepCurrent = 0
  @HostListener('window:resize')
  resize() {
    this.importsCardHeight = `${Math.floor((window.innerHeight - 112) * 0.4)}px`
    this.importsHeight = `${Math.floor((window.innerHeight - 112) * 0.4 - 72)}px`
    this.toolHeight = `${Math.floor((window.innerHeight - 112) * 0.6)}px`
    this.runtimeToolboxHeight = Math.floor((window.innerHeight - 112) * 0.6) - 36
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
    this.KEY_ENVIRONMENT = this.i18nService.fanyi(I18nKey.KeyEnvironment)
  }

  buildTestMessage() {
    if (FavoriteTargetType.TARGET_TYPE_SCENARIO === this.type) {
      const msg: ScenarioTestWebMessage = {
        summary: this._scenaro.summary,
        description: this._scenaro.description,
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
        this.command.next('start')
      }
      this.testWs.onmessage = (event) => {
        if (event.data) {
          try {
            const res = JSON.parse(event.data)
            this.log.next(res)
          } catch (error) {
            this.msgService.error(error)
            this.testWs.close()
          }
        }
      }
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
    this.title = ''
    this.envImport = undefined
    this.imports = []
    this.fromValue = 0
    this.toValue = 0
    this.steps = []
    this.stepsDataCache = {}
    this.stepsStatusCache = {}
    this.stepCurrent = 0
    this.comment = ''
    this.command.next('reset')
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
        this.comment = response.scenario.comment
        this.url = `/scenario/${response.scenario.group}/${response.scenario.project}/${response.scenario._id}`
        this.imports = this.filterImports(response.scenario.imports)
        response.scenario.steps.forEach((step, i) => {
          switch (step.type) {
            case ScenarioStepType.CASE:
              const cs = response.case[step.id]
              tmp.push({ name: cs.summary, value: i })
              this.stepsDataCache[`case:${step.id}`] = cs
              break
            case ScenarioStepType.DUBBO:
              const dubbo = response.dubbo[step.id]
              tmp.push({ name: dubbo.summary, value: i })
              this.stepsDataCache[`dubbo:${step.id}`] = dubbo
              break
            case ScenarioStepType.SQL:
              const sql = response.sql[step.id]
              tmp.push({ name: sql.summary, value: i })
              this.stepsDataCache[`sql:${step.id}`] = sql
              break
            case ScenarioStepType.DELAY:
              tmp.push(this.toDelayOption(step, i))
              break
            case ScenarioStepType.JUMP:
              tmp.push(this.toJumpOption(step, i))
              break
            default:
              tmp.push({ name: step.type, value: i })
              break
          }
        })
        this.steps = response.scenario.steps
        this.stepsDataCache = { ...this.stepsDataCache }
      } else if (response.job) {
        this.type = FavoriteTargetType.TARGET_TYPE_JOB
        this.title = response.job.summary
        this._job = response.job
        this._job._id = response.jobId
        this.comment = response.job.comment
        this.url = `/job/${response.job.group}/${response.job.project}/${response.jobId}`
        this.imports = this.filterImports(response.job.imports)
        response.job.jobData.scenario.forEach((step, i) => {
          switch (step.type) {
            case ScenarioStepType.DELAY:
              tmp.push(this.toDelayOption(step, i))
              break
            case ScenarioStepType.JUMP:
              tmp.push(this.toJumpOption(step, i))
              break
            default:
              if (isJobScenarioStep(step)) {
                tmp.push({ name: response.scenarios[step.id].summary, value: i })
              }
              break
          }
        })
      }
      this.from = [...tmp]
      this.fromValue = 0
      this.toValue = this.from.length - 1
    })
  }

  private toDelayOption(step: ScenarioStep, i: number): NameValue {
    let dName = ''
    if (step.data && step.data.delay) {
      const d = step.data.delay
      dName = `${this.i18nService.fanyi(I18nKey.TipsDelayStep)} ${d.value} ${d.timeUnit}`
    }
    return { name: dName, value: i }
  }

  private toJumpOption(step: ScenarioStep, i: number): NameValue {
    let jName = ''
    if (step.data && step.data.jump) {
      const j = step.data.jump
      if (0 === j.type) {
        jName = `${this.i18nService.fanyi(I18nKey.TipsJumpStep)} to: ${j.conditions.map(c => c.to).join(',')}`
      } else {
        jName = `${this.i18nService.fanyi(I18nKey.TipsJumpStep)} by script`
      }
    }
    return { name: jName, value: i }
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

  ngAfterViewInit(): void {
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
