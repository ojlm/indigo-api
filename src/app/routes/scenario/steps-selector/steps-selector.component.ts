import { Location } from '@angular/common'
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { SortablejsOptions } from 'angular-sortablejs'
import { dubboRequestSignature } from 'app/api/service/dubbo.service'
import { sqlRequestSignature } from 'app/api/service/sql.service'
import { CaseModelComponent } from 'app/routes/case/case-model/case-model.component'
import { DubboPlaygroundComponent } from 'app/routes/dubbo/dubbo-playground/dubbo-playground.component'
import { SqlPlaygroundComponent } from 'app/routes/sql/sql-playground/sql-playground.component'
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import {
  caseToScenarioStep,
  dubboRequestToScenarioStep,
  getScenarioStepCacheKey,
  ScenarioResponse,
  ScenarioStepType,
  sqlRequestToScenarioStep,
} from '../../../api/service/scenario.service'
import { ActorEvent } from '../../../model/api.model'
import { Case, ContextOptions, DubboRequest, ReportItemEvent, ScenarioStep, SqlRequest } from '../../../model/es.model'
import { calcDrawerWidth } from '../../../util/drawer'
import { ScenarioStepData, StepEvent } from '../select-step/select-step.component'

@Component({
  selector: 'app-steps-selector',
  styles: [`
    .hover-red {
      font-weight: bold;
      font-style: oblique;
      display: none;
      transition: all 0.3s ease;
    }
    .step-title-wrapper {
      display: flex;
      margin-right: 12px;
    }
    .step-title {
      width: 100%;
    }
    .step-title:hover {
      cursor: pointer;
    }
    .step:hover .hover-red {
      display: inline-block;
    }
    .step:hover .hover-red:hover {
      color: red;
      transform: rotate(180deg);
    }
    .step .small-text {
      padding-left: 4px;
      color: darkgray;
    }
    .step .check {
      padding-right: 4px;
    }
    .step .tail-labels {
      float: right;
      transform: scale(0.8);
    }
    .step .tail-text {
      float: right;
      color: lightslategrey;
      font-size: small;
    }
  `],
  templateUrl: './steps-selector.component.html',
})
export class StepsSelectorComponent implements OnInit {

  @Input() group: string
  @Input() project: string
  sortablejsOptions: SortablejsOptions = {
    handle: '.anticon-bars',
    onUpdate: function (event: any) {
      this.clearStatus()
      this.modelChange()
    }.bind(this)
  }
  stepListDrawerWidth = calcDrawerWidth(0.7)
  stepListDrawerSwitch = false
  stepListDrawerVisible = false
  steps: ScenarioStep[] = []
  stepsDataCache: { [k: string]: ScenarioStepData } = {}
  stepsStatusCache: { [k: number]: StepStatusData } = {}
  stepCurrent = 0
  onSelectSubject: Subject<StepEvent> = new Subject()
  onUpdateSubject: Subject<StepEvent> = new Subject()
  @Input()
  set scenarioResponse(val: ScenarioResponse) {
    if (val.case) {
      for (const k of Object.keys(val.case)) {
        this.stepsDataCache[`case:${k}`] = val.case[k]
      }
    }
    if (val.dubbo) {
      for (const k of Object.keys(val.dubbo)) {
        this.stepsDataCache[`dubbo:${k}`] = val.dubbo[k]
      }
    }
    if (val.sql) {
      for (const k of Object.keys(val.sql)) {
        this.stepsDataCache[`sql:${k}`] = val.sql[k]
      }
    }
  }
  @Input() eventSubject: Subject<ActorEvent<ReportItemEvent>>
  @Input()
  set data(steps: ScenarioStep[]) {
    if (steps.length > 0 && this.steps.length === 0) {
      this.steps = steps
    } else if (steps.length === 0 && this.steps.length !== 0) {
      this.steps = []
      this.stepsDataCache = {}
      this.stepsStatusCache = {}
    }
  }
  get data() {
    return this.steps
  }
  _ctxOptions: ContextOptions = {}
  @Input()
  set ctxOptions(val: ContextOptions) {
    if (val) {
      this._ctxOptions = val
    }
  }
  @Output() dataChange = new EventEmitter<ScenarioStep[]>()
  @HostListener('window:resize')
  resize() {
    this.stepListDrawerWidth = calcDrawerWidth(0.7)
  }

  constructor(
    private drawerService: NzDrawerService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
  }

  selectStep() {
    this.stepListDrawerSwitch = true
    this.stepListDrawerVisible = true
  }

  addNewHttpStep() {
    this.drawerService.create({
      nzWidth: this.stepListDrawerWidth,
      nzContent: CaseModelComponent,
      nzContentParams: {
        group: this.group,
        project: this.project,
        isInDrawer: true,
        ctxOptions: this._ctxOptions,
        newStep: (stepData: Case) => {
          this.onSelectSubject.next({ step: caseToScenarioStep(stepData), stepData: stepData })
        },
        updateStep: (stepData: Case) => {
          this.onUpdateSubject.next({ step: caseToScenarioStep(stepData), stepData: stepData })
        },
      },
      nzBodyStyle: {
        padding: '4px'
      },
      nzClosable: false,
    })
  }

  addNewSqlStep() {
    this.drawerService.create({
      nzWidth: this.stepListDrawerWidth,
      nzContent: SqlPlaygroundComponent,
      nzContentParams: {
        group: this.group,
        project: this.project,
        isInDrawer: true,
        ctxOptions: this._ctxOptions,
        newStep: (stepData: SqlRequest) => {
          this.onSelectSubject.next({ step: sqlRequestToScenarioStep(stepData), stepData: stepData })
        },
        updateStep: (stepData: SqlRequest) => {
          this.onUpdateSubject.next({ step: sqlRequestToScenarioStep(stepData), stepData: stepData })
        },
      },
      nzBodyStyle: {
        padding: '4px'
      },
      nzClosable: false,
    })
  }

  addNewDubboStep() {
    this.drawerService.create({
      nzWidth: this.stepListDrawerWidth,
      nzContent: DubboPlaygroundComponent,
      nzContentParams: {
        group: this.group,
        project: this.project,
        isInDrawer: true,
        ctxOptions: this._ctxOptions,
        newStep: (stepData: DubboRequest) => {
          this.onSelectSubject.next({ step: dubboRequestToScenarioStep(stepData), stepData: stepData })
        },
        updateStep: (stepData: DubboRequest) => {
          this.onUpdateSubject.next({ step: dubboRequestToScenarioStep(stepData), stepData: stepData })
        },
      },
      nzBodyStyle: {
        padding: '4px'
      },
      nzClosable: false,
    })
  }

  onStepAdded(event: StepEvent) {
    this.clearStatus()
    const step = event.step
    const stepData = event.stepData
    this.stepsDataCache[getScenarioStepCacheKey(step)] = stepData
    this.steps.push(step)
    this.steps = [...this.steps]
    this.modelChange()
  }

  onStepUpdate(event: StepEvent) {
    this.clearStatus()
    const step = event.step
    const stepData = event.stepData
    const tmpSteps = []
    this.steps.forEach(i => {
      if (i.id === step.id) {
        tmpSteps.push(step)
        this.stepsDataCache[getScenarioStepCacheKey(step)] = stepData
      } else {
        tmpSteps.push(i)
      }
    })
    this.steps = tmpSteps
  }

  modelChange() {
    this.dataChange.emit(this.data)
  }

  removeStep(step: ScenarioStep, i: number) {
    this.clearStatus()
    this.steps.splice(i, 1)
    let count = 1
    this.steps.forEach(item => {
      if (item.id === step.id) {
        count++
      }
    })
    if (count === 1) {
      const stepCacheKey = getScenarioStepCacheKey(step)
      delete this.stepsDataCache[stepCacheKey]
    }
    this.modelChange()
  }

  getDubboRequestSignature(step: ScenarioStep) {
    const stepData = this.stepsDataCache[getScenarioStepCacheKey(step)] as DubboRequest
    if (stepData) {
      return dubboRequestSignature(stepData)
    } else {
      return ''
    }
  }

  getSqlRequestSignature(step: ScenarioStep) {
    const stepData = this.stepsDataCache[getScenarioStepCacheKey(step)] as SqlRequest
    if (stepData) {
      return sqlRequestSignature(stepData)
    } else {
      return ''
    }
  }

  methodTagColor(step: ScenarioStep) {
    const stepData = this.stepsDataCache[getScenarioStepCacheKey(step)] as Case
    if (stepData) {
      switch (stepData.request.method) {
        case 'GET':
          return 'green'
        case 'DELETE':
          return 'red'
        case 'POST':
          return 'cyan'
        case 'PUT':
          return 'blue'
        default:
          return 'purple'
      }
    }
  }

  viewStep(idx: number, step: ScenarioStep) {
    const item = this.stepsStatusCache[idx]
    let stepResult: any
    if (item && item.report) {
      if (item.report.result) {
        stepResult = item.report.result
        const ctx = item.report.result.context
        if (ctx) {
          const initCtx = { ...ctx }
          delete initCtx['entity']
          delete initCtx['headers']
          delete initCtx['status']
          if (this._ctxOptions) {
            this._ctxOptions.initCtx = initCtx
            this._ctxOptions = { ...this._ctxOptions }
          }
        }
      }
    } else {
      stepResult = null
      this._ctxOptions.initCtx = {}
      this._ctxOptions = { ...this._ctxOptions }
    }
    if (ScenarioStepType.CASE === step.type) {
      this.openStepModelDrawer(step, stepResult, CaseModelComponent)
    } else if (ScenarioStepType.DUBBO === step.type) {
      this.openStepModelDrawer(step, stepResult, DubboPlaygroundComponent)
    } else if (ScenarioStepType.SQL === step.type) {
      this.openStepModelDrawer(step, stepResult, SqlPlaygroundComponent)
    }
  }

  openStepModelDrawer(step: ScenarioStep, stepResult: object, component: any) {
    this.drawerService.create({
      nzWidth: this.stepListDrawerWidth,
      nzContent: component,
      nzContentParams: {
        group: this.group,
        project: this.project,
        id: step.id,
        ctxOptions: this._ctxOptions,
        result: stepResult,
        isInDrawer: true,
        newStep: (stepData: any) => {
          if (ScenarioStepType.CASE === step.type) {
            this.onSelectSubject.next({ step: caseToScenarioStep(stepData), stepData: stepData })
          } else if (ScenarioStepType.DUBBO === step.type) {
            this.onSelectSubject.next({ step: dubboRequestToScenarioStep(stepData), stepData: stepData })
          } else if (ScenarioStepType.SQL === step.type) {
            this.onSelectSubject.next({ step: sqlRequestToScenarioStep(stepData), stepData: stepData })
          }
        },
        updateStep: (stepData: any) => {
          if (ScenarioStepType.CASE === step.type) {
            this.onUpdateSubject.next({ step: caseToScenarioStep(stepData), stepData: stepData })
          } else if (ScenarioStepType.DUBBO === step.type) {
            this.onUpdateSubject.next({ step: dubboRequestToScenarioStep(stepData), stepData: stepData })
          } else if (ScenarioStepType.SQL === step.type) {
            this.onUpdateSubject.next({ step: sqlRequestToScenarioStep(stepData), stepData: stepData })
          }
        },
      },
      nzBodyStyle: {
        padding: '4px'
      },
      nzClosable: false,
    })
  }

  getStepData(step: ScenarioStep) {
    return this.stepsDataCache[getScenarioStepCacheKey(step)] || {}
  }

  getStepStatus(idx: number, step: ScenarioStep) {
    return this.stepsStatusCache[idx] || {}
  }

  clearStatus() {
    for (let i = 0; i < this.steps.length; ++i) {
      this.stepsStatusCache[i] = {}
    }
  }

  ngOnInit(): void {
    if (this.route.parent && this.route.parent.parent) {
      this.route.parent.parent.params.subscribe(params => {
        this.group = params['group']
        this.project = params['project']
      })
    }
    if (this.eventSubject) {
      this.eventSubject.subscribe(log => {
        const reportItem = log.data
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
      })
    }
    this.onSelectSubject.subscribe(event => {
      this.onStepAdded(event)
    })
    this.onUpdateSubject.subscribe(event => {
      this.onStepUpdate(event)
    })
  }
}

interface StepStatusData {
  report?: ReportItemEvent
  status?: string
}
