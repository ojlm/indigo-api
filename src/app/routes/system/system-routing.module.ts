import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { CountComponent } from './count/count.component'
import { GitlabSyncComponent } from './gitlab-sync/gitlab-sync.component'
import { GroupUserTrendComponent } from './group-user-trend/group-user-trend.component'
import { JobReportIndicesComponent } from './job-report-indices/job-report-indices.component'
import { RequestsFundComponent } from './requests-fund/requests-fund.component'
import { SystemJobsComponent } from './system-jobs/system-jobs.component'

const routes: Routes = [
  { path: 'count', component: CountComponent, data: { titleI18n: 'title-count' } },
  { path: 'fund', component: RequestsFundComponent, data: { titleI18n: 'title-fund' } },
  { path: 'trend', component: GroupUserTrendComponent, data: { titleI18n: 'title-trend' } },
  { path: 'settings', component: JobReportIndicesComponent, data: { titleI18n: 'title-system' } },
  { path: 'jobs', component: SystemJobsComponent, data: { titleI18n: 'title-system' } },
  { path: 'gitlab', component: GitlabSyncComponent, data: { titleI18n: 'title-gitlab' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule { }
