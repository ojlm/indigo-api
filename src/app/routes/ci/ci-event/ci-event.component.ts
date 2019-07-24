import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { I18NService } from '@core'
import { I18nKey } from '@core/i18n/i18n.message'
import { httpRequestSignature } from 'app/api/service/case.service'
import { dubboRequestSignature } from 'app/api/service/dubbo.service'
import {
  caseToScenarioStep,
  dubboRequestToScenarioStep,
  ScenarioStepType,
  sqlRequestToScenarioStep,
} from 'app/api/service/scenario.service'
import { sqlRequestSignature } from 'app/api/service/sql.service'
import { TriggerResponse, TriggerService } from 'app/api/service/trigger.service'
import { Case, CiTrigger, DubboRequest, Job, SqlRequest } from 'app/model/es.model'
import { SelectJobComponent } from 'app/routes/scenario/select-job/select-job.component'
import { SelectStepComponent, StepEvent } from 'app/routes/scenario/select-step/select-step.component'
import { calcDrawerWidth } from 'app/util/drawer'
import { NzDrawerRef, NzDrawerService, NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-ci-event',
  templateUrl: './ci-event.component.html',
  styles: []
})
export class CiEventComponent implements OnInit {

  drawerRef: NzDrawerRef
  drawerWidth = calcDrawerWidth(0.75)
  readinessSubject = new Subject<StepEvent>()
  readinessTarget: StepEvent = {}
  job: Job = {}
  jobSubject = new Subject<StepEvent>()
  @Input() group = ''
  @Input() project = ''
  isSending = false
  isSaved = true
  request: CiTrigger = {
    debounce: 1000,
    readiness: {
      enabled: false,
      delay: 30,
      interval: 10,
      timeout: 1,
      retries: 3,
    }
  }

  constructor(
    private triggerService: TriggerService,
    private drawerService: NzDrawerService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private route: ActivatedRoute,
  ) {
    this.readinessSubject.subscribe(event => {
      const step = event.step
      this.request.readiness.targetType = step.type
      this.request.readiness.targetId = step.id
      this.readinessTarget = event
      this.drawerRef.close()
    })
    this.jobSubject.subscribe(event => {
      this.request.targetType = event.step.type
      this.request.targetId = event.step.id
      this.job = event.stepData
      this.drawerRef.close()
    })
  }

  jobTips() {
    if (this.job) {
      return this.job.summary
    } else {
      return ''
    }
  }

  readinessTargetTips() {
    if (this.readinessTarget && this.readinessTarget.step) {
      const stepData = this.readinessTarget.stepData
      let signature = ''
      switch (this.readinessTarget.step.type) {
        case ScenarioStepType.CASE:
          signature = httpRequestSignature(stepData as Case)
          return `${stepData.summary},  ${signature}`
        case ScenarioStepType.SQL:
          signature = sqlRequestSignature(stepData as SqlRequest)
          return `${stepData.summary},  ${signature}`
        case ScenarioStepType.DUBBO:
          signature = dubboRequestSignature(stepData as DubboRequest)
          return `${stepData.summary},  ${signature}`
        default:
          return ''
      }
    } else {
      return ''
    }
  }

  save() {
    if (this.request._id) {
      this.triggerService.update(this.request._id, this.request).subscribe(res => {
        this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      })
    } else {
      this.triggerService.index(this.request).subscribe(res => {
        this.request._id = res.data.id
        this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      })
    }
  }

  selectJob() {
    this.drawerRef = this.drawerService.create({
      nzWidth: this.drawerWidth,
      nzContent: SelectJobComponent,
      nzContentParams: {
        group: this.group,
        project: this.project,
        onSelectSubject: this.jobSubject,
      },
      nzBodyStyle: {
        padding: '4px'
      },
      nzClosable: false,
    })
  }

  select() {
    this.drawerRef = this.drawerService.create({
      nzWidth: this.drawerWidth,
      nzContent: SelectStepComponent,
      nzContentParams: {
        group: this.group,
        project: this.project,
        onSelectSubject: this.readinessSubject,
      },
      nzBodyStyle: {
        padding: '4px'
      },
      nzClosable: false,
    })
  }

  modelChange() {
    this.isSaved = false
  }

  ngOnInit(): void {
    if (this.route.parent && this.route.parent.parent) {
      this.route.parent.parent.params.subscribe(params => {
        this.group = params['group']
        this.project = params['project']
        this.request.group = this.group
        this.request.project = this.project
      })
      this.route.parent.params.subscribe(params => {
        const docId = params['ciId']
        if (docId) {
          this.triggerService.getById(docId).subscribe(res => {
            this.request = res.data.trigger
            this.request._id = docId
            this.job = res.data.target || {}
            this.readinessTarget = this.toReadiness(res.data)
          })
        }
      })
    }
  }

  private toReadiness(res: TriggerResponse) {
    const readiness = res.trigger.readiness
    const data = res.readiness
    if (readiness && readiness.targetId) {
      switch (readiness.targetType) {
        case ScenarioStepType.CASE:
          return { step: caseToScenarioStep(data as Case), stepData: data }
        case ScenarioStepType.SQL:
          return { step: sqlRequestToScenarioStep(data as SqlRequest), stepData: data }
        case ScenarioStepType.DUBBO:
          return { step: dubboRequestToScenarioStep(data as DubboRequest), stepData: data }
        default:
          return {}
      }
    } else {
      return {}
    }
  }
}
