import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { SettingsService } from '@delon/theme'

@Component({
  selector: 'header-new',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="item" nz-dropdown>
      <i class="anticon anticon-plus"></i>
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item (click)="newGroup()"><i class="anticon anticon-coffee mr-sm"></i>{{'new-group' | translate}}</div>
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="newProject()"><i class="anticon anticon-coffee mr-sm"></i>{{'new-project' | translate}}</div>
      <div nz-menu-item (click)="newJob()"><i class="anticon anticon-coffee mr-sm"></i>{{'new-job' | translate}}</div>
      <li *ngIf="project" nz-menu-divider></li>
      <div *ngIf="project" nz-menu-item (click)="newApi()"><i class="anticon anticon-plus-square-o mr-sm"></i>{{'new-api' | translate}}</div>
      <div *ngIf="project" nz-menu-item (click)="newCase()"><i class="anticon anticon-plus-square-o mr-sm"></i>{{'new-case' | translate}}</div>
      <div *ngIf="project" nz-menu-item (click)="newScenario()"><i class="anticon anticon-plus-square-o mr-sm"></i>{{'new-scenario' | translate}}</div>
      <div *ngIf="project" nz-menu-item (click)="newEnv()"><i class="anticon anticon-plus-square-o mr-sm"></i>{{'new-env' | translate}}</div>
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
    if (this.group) {
      this.router.navigateByUrl(`/jobs/new?group=${this.group}`)
    } else {
      this.router.navigateByUrl('/jobs/new')
    }
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
