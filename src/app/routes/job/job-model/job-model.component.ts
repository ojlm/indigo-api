import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CaseService } from '../../../api/service/case.service'
import { JobService } from '../../../api/service/job.service'
import { ActorEvent, APICODE } from '../../../model/api.model'
import { JobExecDesc } from '../../../model/es.model'
import { JobMeta, JobTestMessage } from '../../../model/job.model'
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
  transferStyle = {
    'width.px': 300,
    'height.px': 300
  }
  group: string
  project: string
  submitting = false
  jobMeta: JobMeta = {}
  jobCaseIds = []
  testWs: WebSocket
  logSubject = new Subject<ActorEvent<JobExecDesc>>()

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private jobService: JobService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    super()
  }

  test() {
    if (this.testWs) {
      this.testWs.close()
      this.testWs = null
    }
    this.testWs = this.jobService.newTestWs()
    this.testWs.onopen = (event) => {
      const testMessage: JobTestMessage = {
        jobMeta: {},
        jobData: {}
      }
      this.testWs.send(JSON.stringify(testMessage))
    }
    this.testWs.onmessage = (event) => {
      if (event.data) {
        try {
          const res = JSON.parse(event.data) as ActorEvent<JobExecDesc>
          if (APICODE.OK === res.code) {
            this.logSubject.next(res)
          } else {
            this.msgService.error(res.msg)
          }
        } catch (error) {
          this.msgService.error(error)
          this.testWs.close()
        }
      }
    }
  }

  submit() {
    // this.submitting = true
    // this.jobService.index({}).subscribe(res => {
    //   this.submitting = false
    // }, err => this.submitting = false)
  }

  goBack() {
    this.location.back()
  }

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
    })
  }
}
