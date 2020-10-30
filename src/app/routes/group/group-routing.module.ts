import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { GroupJobsComponent } from './group-jobs/group-jobs.component'
import { GroupMembersComponent } from './group-members/group-members.component'
import { GroupOptionsComponent } from './group-options/group-options.component'
import { GroupSettingsComponent } from './group-settings/group-settings.component'

const routes: Routes = [
  { path: 'jobs', component: GroupJobsComponent },
  { path: 'settings', component: GroupSettingsComponent },
  { path: 'options', component: GroupOptionsComponent },
  { path: 'members', component: GroupMembersComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupRoutingModule { }
