import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ClusterDashboardComponent } from './cluster-dashboard/cluster-dashboard.component'


const routes: Routes = [
  { path: '', component: ClusterDashboardComponent, data: { titleI18n: 'title-cluster-dashboard' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClusterRoutingModule { }
