import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { NgxChartsModule } from '@swimlane/ngx-charts'

import { DashboardRoutingModule } from './dashboard-routing.module'
import { GroupsComponent } from './groups/groups.component'
import { ProjectsComponent } from './projects/projects.component'
import { UserAggregationComponent } from './user-aggregation/user-aggregation.component'
import { UserProfileComponent } from './user-profile/user-profile.component'

const COMPONENT = [
  GroupsComponent,
  ProjectsComponent,
  UserProfileComponent,
  UserAggregationComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [CommonModule, SharedModule, NgxChartsModule, DashboardRoutingModule],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class DashboardModule { }
