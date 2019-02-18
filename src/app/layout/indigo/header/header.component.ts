import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { SettingsService } from '@delon/theme'

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  searchToggleStatus: boolean

  constructor(
    public settings: SettingsService,
    private router: Router,
  ) { }

  toggleCollapsedSideabar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed)
  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus
  }

  goDubbo() {
    this.router.navigateByUrl(`/dubbo`)
  }

  goCluster() {
    this.router.navigateByUrl(`/cluster`)
  }

  goHelp() {
    window.open('https://docs.asura.pro')
  }
}
