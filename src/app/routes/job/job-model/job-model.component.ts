import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CaseService, QueryCase } from '../../../api/service/case.service'
import { JobService } from '../../../api/service/job.service'
import { ApiRes } from '../../../model/api.model'
import { Case } from '../../../model/es.model'
import { JobMeta } from '../../../model/job.model'
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
    'background-color': 'seashell'
  }
  transferStyle = {
    'width.px': 300,
    'height.px': 300
  }
  group: string
  project: string
  submitting = false
  jobMeta: JobMeta = {}
  items: Case[] = []
  searchCase: Subject<QueryCase>
  caseDrawerVisible = false
  editCaseId: string

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
    const response = new Subject<ApiRes<Case[]>>()
    response.subscribe(res => {
      this.pageTotal = res.data.total
      this.items = res.data.list
    })
    this.searchCase = this.caseService.newQuerySubject(response)
  }

  viewCase(item: Case) {
    console.log(item)
    this.editCaseId = item._id
    this.caseDrawerVisible = true
  }

  test() {

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
      this.searchCase.next({ group: this.group, project: this.project })
    })
  }
}
