import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ProjectOpenapiComponent } from './project-openapi/project-openapi.component'
import { ProjectOptionsComponent } from './project-options/project-options.component'
import { ProjectReportsComponent } from './project-reports/project-reports.component'
import { ProjectSettingsComponent } from './project-settings/project-settings.component'

const routes: Routes = [
  { path: 'settings', component: ProjectSettingsComponent },
  { path: 'openapi', component: ProjectOpenapiComponent },
  { path: 'report', component: ProjectReportsComponent },
  { path: 'options', component: ProjectOptionsComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule { }
