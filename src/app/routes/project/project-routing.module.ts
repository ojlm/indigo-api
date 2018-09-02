import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ProjectOpenapiComponent } from './project-openapi/project-openapi.component'
import { ProjectSettingsComponent } from './project-settings/project-settings.component'


const routes: Routes = [
  { path: 'settings', component: ProjectSettingsComponent },
  { path: 'openapi', component: ProjectOpenapiComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule { }
