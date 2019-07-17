import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { NgxChartsModule } from '@swimlane/ngx-charts'

import { ApiMetricsTrendComponent } from './api-metrics-trend/api-metrics-trend.component'
import { CountItemTrendComponent } from './count-item-trend/count-item-trend.component'
import { CountComponent } from './count/count.component'
import { DashboardRoutingModule } from './dashboard-routing.module'
import { DomainApiItemComponent } from './domain-api-item/domain-api-item.component'
import { DomainApiOnlineComponent } from './domain-api-online/domain-api-online.component'
import { DomainOnlineConfigComponent } from './domain-online-config/domain-online-config.component'
import { GroupUserTrendComponent } from './group-user-trend/group-user-trend.component'
import { GroupsComponent } from './groups/groups.component'
import { ProjectsComponent } from './projects/projects.component'
import { RequestsFundComponent } from './requests-fund/requests-fund.component'
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
  ApiMetricsTrendComponent,
  RequestsFundComponent,
  CountComponent,
  CountItemTrendComponent,
]

const COMPONENT_NOROUNT = [
  DomainOnlineConfigComponent,
  ApiMetricsTrendComponent,
  CountItemTrendComponent,
]

@NgModule({
  imports: [CommonModule, SharedModule, NgxChartsModule, DashboardRoutingModule],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class DashboardModule { }
