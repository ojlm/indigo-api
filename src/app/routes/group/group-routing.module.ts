import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { GroupJobsComponent } from './group-jobs/group-jobs.component'
import { GroupProjectsComponent } from './group-projects/group-projects.component'
import { GroupSettingsComponent } from './group-settings/group-settings.component'

const routes: Routes = [
  { path: 'jobs', component: GroupJobsComponent },
  { path: 'settings', component: GroupSettingsComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupRoutingModule { }
