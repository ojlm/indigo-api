import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { GroupsComponent } from './groups/groups.component'
import { ProjectsComponent } from './projects/projects.component'
import { UserAggregationComponent } from './user-aggregation/user-aggregation.component'
import { UserProfileComponent } from './user-profile/user-profile.component'

const routes: Routes = [
  { path: 'groups', component: GroupsComponent, data: { titleI18n: 'title-groups' } },
  { path: 'projects', component: ProjectsComponent, data: { titleI18n: 'title-projects' } },
  { path: 'profile', component: UserProfileComponent, data: { titleI18n: 'title-profile' } },
  { path: ':username', component: UserAggregationComponent, data: { titleI18n: 'title-aggs' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
