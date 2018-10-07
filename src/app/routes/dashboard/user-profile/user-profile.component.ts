import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { SettingsService } from '@delon/theme'
import { NzMessageService } from 'ng-zorro-antd'

import { UserService } from '../../../api/service/user.service'
import { UserProfile } from '../../../model/user.model'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {

  form: FormGroup
  submitting = false
  username = ''

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    public settings: SettingsService,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: [{ value: null, disabled: true }, [Validators.required]],
      nickname: [null, []],
      description: [null, []],
      email: [null, [Validators.email, Validators.required]],
      avatar: [null, []],
    })
    this.userService.get().subscribe(res => {
      const profile = res.data
      this.username = profile.username
      this.form = this.fb.group({
        username: [{ value: profile.username, disabled: true }, [Validators.required]],
        nickname: [profile.nickname, []],
        description: [profile.description, []],
        email: [profile.email, [Validators.email, Validators.required]],
        avatar: [profile.avatar, []],
      })
    })
  }

  submit() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty()
      this.form.controls[i].updateValueAndValidity()
    }
    if (this.form.invalid) return
    const profile = this.form.value as UserProfile
    profile.username = this.username
    this.submitting = true
    this.userService.update(profile).subscribe(res => {
      this.submitting = false
      this.settings.setUser(profile)
      this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
    }, errRes => {
      this.submitting = false
    })
  }

  goBack() {
    this.location.back()
  }
}
