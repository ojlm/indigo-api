import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { DomainApiOnlineComponent } from './domain-api-online/domain-api-online.component'
import { GroupsComponent } from './groups/groups.component'
import { ProjectsComponent } from './projects/projects.component'
import { UserProfileComponent } from './user-profile/user-profile.component'

const routes: Routes = [
  { path: 'groups', component: GroupsComponent, data: { titleI18n: 'title-groups' } },
  { path: 'projects', component: ProjectsComponent, data: { titleI18n: 'title-projects' } },
  { path: 'profile', component: UserProfileComponent, data: { titleI18n: 'title-profile' } },
  { path: 'online', component: DomainApiOnlineComponent, data: { titleI18n: 'menu-online-api' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
