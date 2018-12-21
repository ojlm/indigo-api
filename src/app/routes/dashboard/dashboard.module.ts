import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { NgxChartsModule } from '@swimlane/ngx-charts'

import { DashboardRoutingModule } from './dashboard-routing.module'
import { DomainApiItemComponent } from './domain-api-item/domain-api-item.component'
import { DomainApiOnlineComponent } from './domain-api-online/domain-api-online.component'
import { DomainOnlineConfigComponent } from './domain-online-config/domain-online-config.component'
import { GroupUserTrendComponent } from './group-user-trend/group-user-trend.component'
import { GroupsComponent } from './groups/groups.component'
import { ProjectsComponent } from './projects/projects.component'
import { UserAggregationComponent } from './user-aggregation/user-aggregation.component'
import { UserProfileComponent } from './user-profile/user-profile.component'

const COMPONENT = [
  GroupsComponent,
  ProjectsComponent,
  UserProfileComponent,
  UserAggregationComponent,
  GroupUserTrendComponent,
  DomainApiOnlineComponent,
  DomainOnlineConfigComponent,
  DomainApiItemComponent,
]

const COMPONENT_NOROUNT = [
  DomainOnlineConfigComponent,
]

@NgModule({
  imports: [CommonModule, SharedModule, NgxChartsModule, DashboardRoutingModule],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class DashboardModule { }
