import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { GroupsComponent } from './groups/groups.component'

const routes: Routes = [
  { path: 'groups', component: GroupsComponent, data: { title: 'Groups' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
