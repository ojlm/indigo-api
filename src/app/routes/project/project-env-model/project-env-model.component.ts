import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { EnvService } from '../../../api/service/env.service'
import { Environment } from '../../../model/es.model'

@Component({
  selector: 'app-project-env-model',
  templateUrl: './project-env-model.component.html',
})
export class ProjectEnvModelComponent implements OnInit {

  group: string
  project: string
  form: FormGroup
  env: Environment
  submitting = false

  constructor(
    private fb: FormBuilder,
    private envService: EnvService,
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
    const env = { ...this.form.value as Environment, ...this.env }
    this.submitting = true
    this.envService.index(env).subscribe(res => {
      this.submitting = false
    }, err => this.submitting = false)
  }

  goBack() {
    this.location.back()
  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.env = {
        group: this.group,
        project: this.project,
        custom: [],
      }
      this.form = this.fb.group({
        summary: [null, [Validators.required]],
        description: [null, []],
        namespace: [null, []],
      })
    })
  }
}
