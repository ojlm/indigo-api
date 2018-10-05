import { Location } from '@angular/common'
import { HttpHeaders } from '@angular/common/http'
import { Component, Inject, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { StartupService } from '@core/startup/startup.service'
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth'
import { _HttpClient, SettingsService } from '@delon/theme'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

import { API_USER_LOGIN } from '../../../api/path'
import { ApiRes } from '../../../model/api.model'
import { UserProfile } from '../../../model/user.model'

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class UserLoginComponent implements OnDestroy {

  form: FormGroup
  error = ''
  loading = false

  constructor(
    fb: FormBuilder,
    private router: Router,
    private location: Location,
    public msg: NzMessageService,
    private http: _HttpClient,
    private modalSrv: NzModalService,
    private settingsService: SettingsService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private startupSrv: StartupService,
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required]],
      password: [null, Validators.required],
      remember: [true],
    })
    modalSrv.closeAll()
  }

  get userName() {
    return this.form.controls.userName
  }
  get password() {
    return this.form.controls.password
  }

  switch(index: number) {
  }

  submit() {
    this.error = ''
    this.userName.markAsDirty()
    this.userName.updateValueAndValidity()
    this.password.markAsDirty()
    this.password.updateValueAndValidity()
    if (this.userName.invalid || this.password.invalid) return
    this.loading = false
    const auth = `${this.userName.value}:${this.password.value}`
    const headers = new HttpHeaders({ 'Authorization': `Basic ${btoa(auth)}` })
    this.http.get<ApiRes<UserProfile>>(API_USER_LOGIN, null, { headers: headers } as any)
      .subscribe(res => {
        this.tokenService.set({
          token: res.data.token
        })
        this.loading = true
        this.startupSrv.load(res.data).then(() => {
          this.location.back()
        })
      }, err => this.loading = false)
  }

  ngOnDestroy(): void {
  }
}
