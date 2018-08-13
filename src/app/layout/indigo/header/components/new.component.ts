import { Component, Inject } from '@angular/core'
import { Router } from '@angular/router'
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth'
import { SettingsService } from '@delon/theme'

@Component({
  selector: 'header-new',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="item" nz-dropdown>
      <i class="anticon anticon-plus"></i>
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item (click)="newGroup()"><i class="anticon anticon-coffee mr-sm"></i>{{'menu-new-group' | translate}}</div>
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="newProject()"><i class="anticon anticon-coffee mr-sm"></i>{{'menu-new-project' | translate}}</div>
      <div nz-menu-item (click)="newJob()"><i class="anticon anticon-coffee mr-sm"></i>{{'menu-new-job' | translate}}</div>
    </div>
  </nz-dropdown>
  `,
})
export class HeaderNewComponent {
  constructor(
    public settings: SettingsService,
    private router: Router,
  ) { }

  newGroup() {

  }
  newProject() {

  }
  newJob() {

  }
}
