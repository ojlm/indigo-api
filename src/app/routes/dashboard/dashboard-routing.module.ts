import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { GroupsComponent } from './groups/groups.component'
import { ProjectsComponent } from './projects/projects.component'

const routes: Routes = [
  { path: 'groups', component: GroupsComponent, data: { titleI18n: 'title-groups' } },
  { path: 'projects', component: ProjectsComponent, data: { titleI18n: 'title-projects' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
