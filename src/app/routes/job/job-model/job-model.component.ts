import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CaseService } from '../../../api/service/case.service'
import { JobService, NewJob } from '../../../api/service/job.service'
import { ActorEvent, ActorEventType } from '../../../model/api.model'
import { ContextOptions, JobExecDesc, JobNotify } from '../../../model/es.model'
import { JobMeta, TriggerMeta } from '../../../model/job.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-job-model',
  templateUrl: './job-model.component.html',
})
export class JobModelComponent extends PageSingleModel implements OnInit {

  card1BodyStyle = {
    'padding': '12px',
    'background-color': 'aliceblue'
  }
  card2BodyStyle = {
    'padding': '12px',
    'background-color': 'snow'
  }
  jobId: string
  group: string
  project: string
  submitting = false
  jobMeta: JobMeta = {}
  triggerMeta: TriggerMeta = {}
  jobCaseIds: string[] = []
  jobScenarioIds: string[] = []
  testWs: WebSocket
  logSubject = new Subject<ActorEvent<JobExecDesc>>()
  consoleDrawVisible = false
  subscribers: JobNotify[] = []
  ctxOptions: ContextOptions = {}
  reportId = ''

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private jobService: JobService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private i18nService: I18NService,
  ) {
    super()
  }

  test() {
    this.consoleDrawVisible = true
    if (this.testWs) {
      this.testWs.close()
      this.testWs = null
    }
    this.testWs = this.jobService.newTestWs(this.group, this.project, this.jobId)
    this.testWs.onopen = (event) => {
      const testMessage = this.validateAndBuildNewJob(true)
      this.testWs.send(JSON.stringify({ ...testMessage, jobId: this.jobId }))
    }
    this.testWs.onmessage = (event) => {
      if (event.data) {
        try {
          const res = JSON.parse(event.data) as ActorEvent<JobExecDesc>
          if (ActorEventType.ITEM === res.type) {
          } else if (ActorEventType.OVER === res.type) {
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
    const newJob = this.validateAndBuildNewJob(false)
    if (newJob) {
      this.submitting = true
      if (this.jobId) {
        newJob.notifies = undefined
        this.jobService.update(this.jobId, newJob).subscribe(res => {
          this.submitting = false
          this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
        }, err => this.submitting = false)
      } else {
        this.jobService.index(newJob).subscribe(res => {
          this.submitting = false
          this.jobId = res.data.id
          this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
        }, err => this.submitting = false)
      }
    }
  }

  envChange() {
    this.ctxOptions.jobEnv = this.jobMeta.env
  }

  reset() {
    this.jobCaseIds = []
    this.jobScenarioIds = []
    this.jobMeta = {
      group: this.group,
      project: this.project,
      summary: '',
      description: ''
    }
    this.triggerMeta = {
      group: this.group,
      project: this.project
    }
  }

  validateAndBuildNewJob(isTest: boolean) {
    const jobMeta = { ...this.jobMeta }
    const triggerMeta = { ...this.triggerMeta }
    if (!this.jobMeta.summary && !isTest) {
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorEmptySummary))
      return
    }
    if (!(this.jobMeta.group || this.triggerMeta.group) && !isTest) {
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorEmptyGroup))
      return
    }
    if (!(this.jobMeta.project || this.triggerMeta.project) && !isTest) {
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorEmptyProject))
      return
    }
    if (this.jobCaseIds.length < 1 && this.jobScenarioIds.length < 1) {
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorEmptyCaseScenarioCount))
      return
    }
    const newJob: NewJob = {
      jobMeta: jobMeta,
      triggerMeta: triggerMeta,
      jobData: {
        cs: this.jobCaseIds.map(id => {
          return { id: id }
        }),
        scenario: this.jobScenarioIds.map(id => {
          return { id: id }
        })
      },
      notifies: this.subscribers
    }
    return newJob
  }

  goBack() {
    this.location.back()
  }

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.jobMeta.group = this.group
      this.jobMeta.project = this.project
      this.triggerMeta.group = this.group
      this.triggerMeta.project = this.project
    })
    this.route.parent.params.subscribe(params => {
      const jobId = params['jobId']
      if (jobId) {
        this.jobId = jobId
        this.jobService.getById(jobId).subscribe(res => {
          const job = res.data
          this.jobMeta.summary = job.summary
          this.jobMeta.description = job.description
          this.jobMeta.scheduler = job.scheduler
          this.jobMeta.env = job.env
          this.ctxOptions.jobEnv = this.jobMeta.env
          this.jobMeta.classAlias = job.classAlias
          if (job.trigger && job.trigger.length > 0) {
            this.triggerMeta = job.trigger[0]
          }
          if (job.jobData && job.jobData.cs) {
            this.jobCaseIds = job.jobData.cs.map(item => item.id)
          }
          if (job.jobData && job.jobData.scenario) {
            this.jobScenarioIds = job.jobData.scenario.map(item => item.id)
          }
        })
      }
    })
  }
}
