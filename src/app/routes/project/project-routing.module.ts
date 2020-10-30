import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ProjectMembersComponent } from './project-members/project-members.component'
import { ProjectOpenapiComponent } from './project-openapi/project-openapi.component'
import { ProjectOptionsComponent } from './project-options/project-options.component'
import { ProjectReportsComponent } from './project-reports/project-reports.component'
import { ProjectSettingsComponent } from './project-settings/project-settings.component'
import { ProjectSyncSettingsComponent } from './project-sync-settings/project-sync-settings.component'

const routes: Routes = [
  { path: 'settings', component: ProjectSettingsComponent },
  { path: 'openapi', component: ProjectOpenapiComponent },
  { path: 'report', component: ProjectReportsComponent },
  { path: 'options', component: ProjectOptionsComponent },
  { path: 'sync', component: ProjectSyncSettingsComponent },
  { path: 'members', component: ProjectMembersComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule { }
