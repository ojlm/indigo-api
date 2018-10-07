import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { GroupsComponent } from './groups/groups.component'
import { JobsComponent } from './jobs/jobs.component'
import { ProjectsComponent } from './projects/projects.component'
import { UserProfileComponent } from './user-profile/user-profile.component'

const routes: Routes = [
  { path: 'groups', component: GroupsComponent, data: { titleI18n: 'title-groups' } },
  { path: 'projects', component: ProjectsComponent, data: { titleI18n: 'title-projects' } },
  { path: 'jobs', component: JobsComponent, data: { titleI18n: 'title-jobs' } },
  { path: 'profile', component: UserProfileComponent, data: { titleI18n: 'title-profile' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
