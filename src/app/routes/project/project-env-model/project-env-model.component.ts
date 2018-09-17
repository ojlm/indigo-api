import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { NzMessageService } from 'ng-zorro-antd'

import { EnvService } from '../../../api/service/env.service'
import { Environment, KeyValueObject } from '../../../model/es.model'

@Component({
  selector: 'app-project-env-model',
  templateUrl: './project-env-model.component.html',
})
export class ProjectEnvModelComponent implements OnInit {

  envId: string
  group: string
  project: string
  form: FormGroup
  custom: KeyValueObject[] = []
  submitting = false

  constructor(
    private fb: FormBuilder,
    private envService: EnvService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
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
    const env: Environment = {
      group: this.group,
      project: this.project,
      custom: this.custom,
      ...this.form.value as Environment,
    }
    this.submitting = true
    if (this.envId) {
      this.envService.update(this.envId, env).subscribe(res => {
        this.submitting = false
        this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      }, err => this.submitting = false)
    } else {
      this.envService.index(env).subscribe(res => {
        this.submitting = false
        this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      }, err => this.submitting = false)
    }
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
        namespace: [null, []],
      })
    })
    this.route.params.subscribe(params => {
      this.envId = params['envId']
      if (this.envId) {
        this.envService.getById(this.envId).subscribe(res => {
          if (res.data.custom) {
            this.custom = res.data.custom
          }
          this.form = this.fb.group({
            summary: [res.data.summary, [Validators.required]],
            description: [res.data.description, []],
            namespace: [res.data.namespace, []],
          })
        })
      }
    })
  }
}
