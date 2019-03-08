import { Component, Inject } from '@angular/core'
import { Router } from '@angular/router'
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth'
import { SettingsService } from '@delon/theme'

@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown style="cursor:pointer;" nzPlacement="bottomRight">
    <div class="item d-flex align-items-center px-sm" nz-dropdown>
      <nz-avatar [nzText]="(settings.user.nickname||settings.user.username)[0]"
        style="background-color:transparent;"[nzSrc]="settings.user.avatar" nzSize="small" class="mr-sm">
      </nz-avatar>
      <span style="color:lightcoral;">{{settings.user.nickname||settings.user.username}}</span>
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item (click)="goProfile()"><i nz-icon type="profile" theme="outline" class="mr-sm"></i>{{'menu-profile'|translate}}</div>
      <div nz-menu-item (click)="goUserDashboard()"><i nz-icon type="dashboard" theme="outline" class="mr-sm"></i>{{'menu-user-dashboard'|translate}}</div>
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="goTrend()"><i nz-icon type="dot-chart" theme="outline" class="mr-sm"></i>{{'menu-sys-trend'|translate}}</div>
      <div nz-menu-item (click)="goSystem()"><i nz-icon type="setting" theme="outline" class="mr-sm"></i>{{'menu-sys-settings'|translate}}</div>
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="logout()"><i nz-icon type="logout" theme="outline" class="mr-sm"></i>{{'menu-logout'|translate}}</div>
    </div>
  </nz-dropdown>
  `,
})
export class HeaderUserComponent {

  avatarText = ''
  constructor(
    public settings: SettingsService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) { }

  goProfile() {
    this.router.navigateByUrl('/dashboard/profile')
  }

  goUserDashboard() {
    const username = this.settings.user.username
    if (username) {
      this.router.navigateByUrl(`/dashboard/${username}`)
    }
  }

  goSystem() {
    this.router.navigateByUrl('/system/settings')
  }

  goTrend() {
    this.router.navigateByUrl('/dashboard/trend')
  }

  logout() {
    this.tokenService.clear()
    this.router.navigateByUrl(this.tokenService.login_url)
  }
}
