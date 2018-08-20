import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { GroupProjectsComponent } from './group-projects/group-projects.component'

const routes: Routes = [
  { path: '', component: GroupProjectsComponent, data: { titleI18n: 'title-groups' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupRoutingModule { }
