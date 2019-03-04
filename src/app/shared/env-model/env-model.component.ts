import { Location } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { NzMessageService } from 'ng-zorro-antd'

import { EnvService } from '../../api/service/env.service'
import { Authorization, Environment, KeyValueObject } from '../../model/es.model'

@Component({
  selector: 'app-env-model',
  templateUrl: './env-model.component.html',
  styles: [`
    .form-item {
      margin-bottom:10px;
    }
  `]
})
export class EnvModelComponent implements OnInit {

  fromSelector = false
  isIndexed = false
  envId: string
  group: string
  project: string
  form: FormGroup
  enableProxy = false
  server = ''
  auth: Authorization[] = []
  custom: KeyValueObject[] = []
  headers: KeyValueObject[] = []
  submitting = false
  visibleDtabs = false

  @Input()
  set data(value: string) {
    this.fromSelector = true
    this.envId = value
    if (!this.isIndexed) { // prevent perform new request after index
      this.initByEnvId()
    }
    this.route.parent.parent.params.subscribe(params => {
      if (!this.group && !this.project) {
        this.group = params['group']
        this.project = params['project']
      }
    })
  }
  get data() {
    return this.envId
  }
  @Output()
  dataChange = new EventEmitter<string>()
  @Input()
  set name(value: string) {
  }
  get name() {
    return this.form.get('summary').value
  }
  @Output()
  nameChange = new EventEmitter<string>()
  @Output() onclear = new EventEmitter<string>()

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
      headers: this.headers,
      enableProxy: this.enableProxy,
      server: this.server,
      auth: this.auth,
      ...this.form.value as Environment,
    }
    this.submitting = true
    if (this.envId) {
      this.envService.update(this.envId, env).subscribe(res => {
        if (this.fromSelector) {
          this.nameChange.emit(this.name)
        }
        this.submitting = false
        this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      }, err => this.submitting = false)
    } else {
      this.envService.index(env).subscribe(res => {
        this.envId = res.data.id
        this.isIndexed = true
        if (this.fromSelector) {
          this.dataChange.emit(this.envId)
          this.nameChange.emit(this.name)
        }
        this.submitting = false
        this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      }, err => this.submitting = false)
    }
  }

  toggleDtabs() {
    this.visibleDtabs = !this.visibleDtabs
  }

  reset() {
    this.form = this.fb.group({
      summary: [null, [Validators.required]],
      description: [null, []],
      namespace: [null, []],
    })
    this.enableProxy = false
    this.custom = []
    this.headers = []
    this.auth = []
    this.server = ''
  }

  clear() {
    this.reset()
    this.envId = ''
    this.dataChange.emit('')
    this.nameChange.emit('')
    this.onclear.emit('')
  }

  goBack() {
    this.location.back()
  }

  initByEnvId() {
    if (this.envId) {
      this.envService.getById(this.envId).subscribe(res => {
        if (res.data.custom) {
          this.custom = res.data.custom
        }
        if (res.data.headers) {
          this.headers = res.data.headers
        }
        if (this.fromSelector) {
          this.nameChange.emit(res.data.summary)
        }
        this.enableProxy = res.data.enableProxy
        this.server = res.data.server
        this.auth = res.data.auth || []
        this.form = this.fb.group({
          summary: [res.data.summary, [Validators.required]],
          description: [res.data.description, []],
          namespace: [res.data.namespace, []],
        })
      })
    }
  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      if (!this.group && !this.project) {
        this.group = params['group']
        this.project = params['project']
      }
      this.form = this.fb.group({
        summary: [null, [Validators.required]],
        description: [null, []],
        namespace: [null, []],
      })
    })
    this.route.params.subscribe(params => {
      if (params['envId']) {
        this.envId = params['envId']
        this.initByEnvId()
      }
    })
  }
}
