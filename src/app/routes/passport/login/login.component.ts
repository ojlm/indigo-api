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

  constructor(
    fb: FormBuilder,
    private router: Router,
    public msg: NzMessageService,
    private http: _HttpClient,
    private modalSrv: NzModalService,
    private settingsService: SettingsService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private startupSrv: StartupService,
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required, Validators.minLength(5)]],
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

  submit() {
    this.error = ''
    this.userName.markAsDirty()
    this.userName.updateValueAndValidity()
    this.password.markAsDirty()
    this.password.updateValueAndValidity()
    if (this.userName.invalid || this.password.invalid) return
    this.http.get<ApiRes<UserProfile>>(API_USER_LOGIN, { username: this.userName.value, password: this.password.value }).subscribe(res => {
      this.tokenService.set({
        token: res.data.token
      })
      this.startupSrv.load(res.data).then(() => this.router.navigate(['/']))
    })
  }

  ngOnDestroy(): void {
  }
}
