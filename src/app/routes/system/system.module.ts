import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'

import { ClearReportDataIndicesJobComponent } from './clear-report-data-indices-job/clear-report-data-indices-job.component'
import { JobReportIndicesComponent } from './job-report-indices/job-report-indices.component'
import { SyncDomainApiJobComponent } from './sync-domain-api-job/sync-domain-api-job.component'
import { SystemJobsComponent } from './system-jobs/system-jobs.component'
import { SystemPanelComponent } from './system-panel/system-panel.component'
import { SystemRoutingModule } from './system-routing.module'

const COMPONENT = [
  SystemPanelComponent,
  JobReportIndicesComponent,
  SystemJobsComponent,
  ClearReportDataIndicesJobComponent,
  SyncDomainApiJobComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [CommonModule, SharedModule, SystemRoutingModule],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class SystemModule { }
