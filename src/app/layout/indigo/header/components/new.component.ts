import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { SettingsService } from '@delon/theme'

@Component({
  selector: 'header-new',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="alain-default__nav-item" nz-dropdown>
      <i nz-icon type="plus"></i>
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item (click)="newGroup()"><i nz-icon type="coffee"></i>{{'new-group' | translate}}</div>
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="newProject()"><i nz-icon type="coffee"></i>{{'new-project' | translate}}</div>
      <li *ngIf="project" nz-menu-divider></li>
      <div *ngIf="project" nz-menu-item (click)="newJob()">
        <i nz-icon type="plus-square"></i>{{'new-job' | translate}}
      </div>
      <div *ngIf="project" nz-menu-item (click)="newCase()">
        <i nz-icon type="plus-square"></i>{{'new-case' | translate}}
      </div>
      <div *ngIf="project" nz-menu-item (click)="newScenario()">
        <i nz-icon type="plus-square"></i>{{'new-scenario' | translate}}
      </div>
      <div *ngIf="project" nz-menu-item (click)="newEnv()">
        <i nz-icon type="plus-square"></i>{{'new-env' | translate}}
      </div>
    </div>
  </nz-dropdown>
  `,
})
export class HeaderNewComponent {

  group: string
  project: string

  constructor(
    public settings: SettingsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    route.paramMap.subscribe(param => {
      this.group = param.get('group')
      this.project = param.get('project')
    })
  }

  newGroup() {
    this.router.navigateByUrl('/groups/new')
  }
  newProject() {
    if (this.group) {
      this.router.navigateByUrl(`/projects/new?group=${this.group}`)
    } else {
      this.router.navigateByUrl('/projects/new')
    }
  }
  newJob() {
    this.router.navigateByUrl(`/jobs/${this.group}/${this.project}/new`)
  }
  newApi() {
    this.router.navigateByUrl(`/apis/${this.group}/${this.project}/new`)
  }
  newCase() {
    this.router.navigateByUrl(`/cases/${this.group}/${this.project}/new`)
  }
  newScenario() {
    this.router.navigateByUrl(`/scenarios/${this.group}/${this.project}/new`)
  }
  newEnv() {
    this.router.navigateByUrl(`/envs/${this.group}/${this.project}/new`)
  }
}
