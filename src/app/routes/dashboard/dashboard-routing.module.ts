import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { DomainApiOnlineComponent } from './domain-api-online/domain-api-online.component'
import { GroupUserTrendComponent } from './group-user-trend/group-user-trend.component'
import { GroupsComponent } from './groups/groups.component'
import { ProjectsComponent } from './projects/projects.component'
import { RequestsFundComponent } from './requests-fund/requests-fund.component'
import { UserAggregationComponent } from './user-aggregation/user-aggregation.component'
import { UserProfileComponent } from './user-profile/user-profile.component'

const routes: Routes = [
  { path: 'groups', component: GroupsComponent, data: { titleI18n: 'title-groups' } },
  { path: 'projects', component: ProjectsComponent, data: { titleI18n: 'title-projects' } },
  { path: 'profile', component: UserProfileComponent, data: { titleI18n: 'title-profile' } },
  { path: 'fund', component: RequestsFundComponent, data: { titleI18n: 'title-fund' } },
  { path: 'trend', component: GroupUserTrendComponent, data: { titleI18n: 'title-trend' } },
  { path: 'online', component: DomainApiOnlineComponent, data: { titleI18n: 'menu-online-api' } },
  { path: ':username', component: UserAggregationComponent, data: { titleI18n: 'title-aggs' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
