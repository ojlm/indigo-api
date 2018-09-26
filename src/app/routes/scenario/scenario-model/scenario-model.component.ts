import { Location } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CaseService } from '../../../api/service/case.service'
import { ScenarioService } from '../../../api/service/scenario.service'
import { ActorEvent, ActorEventType } from '../../../model/api.model'
import { JobExecDesc, Scenario } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-scenario-model',
  templateUrl: './scenario-model.component.html',
})
export class ScenarioModelComponent extends PageSingleModel implements OnInit {

  fromSelector = false
  card1BodyStyle = {
    'padding': '12px',
    'background-color': 'aliceblue'
  }
  card2BodyStyle = {
    'padding': '12px',
    'background-color': 'snow'
  }
  group: string
  project: string
  scenario: Scenario = { steps: [] }
  scenarioId: string
  submitting = false
  testWs: WebSocket
  logSubject = new Subject<ActorEvent<JobExecDesc>>()
  consoleDrawerVisible = false
  @Input()
  set id(id: string) {
    if (id) {
      this.fromSelector = true
      this.scenarioId = id
      this.loadDataById()
    }
  }

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private scenarioService: ScenarioService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private i18nService: I18NService,
  ) {
    super()
  }

  test() {
    this.consoleDrawerVisible = true
    if (this.testWs) {
      this.testWs.close()
      this.testWs = null
    }
    this.testWs = this.scenarioService.newTestWs()
    this.testWs.onopen = (event) => {
      const testMessage = this.validateAndBuild()
      this.testWs.send(JSON.stringify(testMessage))
    }
    this.testWs.onmessage = (event) => {
      if (event.data) {
        try {
          const res = JSON.parse(event.data) as ActorEvent<JobExecDesc>
          console.log(res)
          if (ActorEventType.ITEM === res.type) {
            // set case result
          } else if (ActorEventType.OVER === res.type) {
            // set scenario report
          } else {
            this.logSubject.next(res)
          }
        } catch (error) {
          this.msgService.error(error)
          this.testWs.close()
        }
      }
    }
  }

  submit() {
    const scenario = this.validateAndBuild()
    if (scenario) {
      this.submitting = true
      if (this.scenarioId) {
        this.scenarioService.update(this.scenarioId, scenario).subscribe(res => {
          this.submitting = false
          this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
        }, err => this.submitting = false)
      } else {
        this.scenarioService.index(scenario).subscribe(res => {
          this.submitting = false
          this.scenarioId = res.data.id
          this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
        }, err => this.submitting = false)
      }
    }
  }

  reset() {
  }

  validateAndBuild() {
    if (!this.scenario.summary) {
      this.msgService.error(this.i18nService.fanyi(I18nKey.ErrorEmptySummary))
      return
    }
    const scenario = { ...this.scenario }
    return scenario
  }

  goBack() {
    this.location.back()
  }

  loadDataById() {
    if (this.scenarioId) {
      this.scenarioService.getById(this.scenarioId).subscribe(res => {
        this.scenario = res.data
        if (!this.scenario.steps) { this.scenario.steps = [] }
      })
    }
  }

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.scenario.group = this.group
      this.scenario.project = this.project
    })
    this.route.parent.params.subscribe(params => {
      const scenarioId = params['scenarioId']
      if (scenarioId) {
        this.scenarioId = scenarioId
        this.loadDataById()
      }
    })
  }
}
