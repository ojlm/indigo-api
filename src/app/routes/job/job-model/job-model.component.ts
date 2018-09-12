import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { JobService } from '../../../api/service/job.service'
import { Job } from '../../../model/es.model'

@Component({
  selector: 'app-job-model',
  templateUrl: './job-model.component.html',
})
export class JobModelComponent implements OnInit {

  group: string
  project: string
  form: FormGroup
  submitting = false

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  submit() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty()
      this.form.controls[i].updateValueAndValidity()
    }
    if (this.form.invalid) return
    const job = { ...this.form.value as Job }
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
      this.form = this.fb.group({
        summary: [null, [Validators.required]],
        description: [null, []],
      })
    })
  }
}
