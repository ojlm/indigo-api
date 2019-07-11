import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Router } from '@angular/router'
import { AssistantService } from '@core/config/assistant.service'
import { SettingsService } from '@delon/theme'

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  searchToggleStatus: boolean

  constructor(
    public settings: SettingsService,
    private assistantService: AssistantService,
    private router: Router,
  ) { }

  toggleCollapsedSideabar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed)
  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus
  }

  goCluster() {
    this.router.navigateByUrl(`/cluster`)
  }

  goHelp() {
    window.open(this.assistantService.docUrl)
  }
}
