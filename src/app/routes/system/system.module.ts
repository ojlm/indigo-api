import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { NgxChartsModule } from '@swimlane/ngx-charts'

import { ClearReportDataIndicesJobComponent } from './clear-report-data-indices-job/clear-report-data-indices-job.component'
import { CountItemTrendComponent } from './count-item-trend/count-item-trend.component'
import { CountComponent } from './count/count.component'
import { GitlabSyncComponent } from './gitlab-sync/gitlab-sync.component'
import { GroupUserTrendComponent } from './group-user-trend/group-user-trend.component'
import { JobReportIndicesComponent } from './job-report-indices/job-report-indices.component'
import { RequestsFundComponent } from './requests-fund/requests-fund.component'
import { SyncDomainApiJobComponent } from './sync-domain-api-job/sync-domain-api-job.component'
import { SystemJobsComponent } from './system-jobs/system-jobs.component'
import { SystemRoutingModule } from './system-routing.module'

const COMPONENT = [
  JobReportIndicesComponent,
  SystemJobsComponent,
  ClearReportDataIndicesJobComponent,
  SyncDomainApiJobComponent,
  GitlabSyncComponent,
  CountItemTrendComponent,
  CountComponent,
  RequestsFundComponent,
  GroupUserTrendComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [CommonModule, SharedModule, NgxChartsModule, SystemRoutingModule],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class SystemModule { }
