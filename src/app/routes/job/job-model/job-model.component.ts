import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { JobService } from '../../../api/service/job.service'
import { JobMeta } from '../../../model/job.model'

@Component({
  selector: 'app-job-model',
  templateUrl: './job-model.component.html',
})
export class JobModelComponent implements OnInit {

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
  list = []

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

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
    this.route.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
    })
  }
}
