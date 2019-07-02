import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { GitlabSyncComponent } from './gitlab-sync/gitlab-sync.component'
import { JobReportIndicesComponent } from './job-report-indices/job-report-indices.component'
import { SystemJobsComponent } from './system-jobs/system-jobs.component'
import { SystemPanelComponent } from './system-panel/system-panel.component'

const routes: Routes = [
  {
    path: '',
    component: SystemPanelComponent,
    children: [
      { path: 'settings', component: JobReportIndicesComponent, data: { titleI18n: 'title-system' } },
      { path: 'jobs', component: SystemJobsComponent, data: { titleI18n: 'title-system' } },
      { path: 'gitlab', component: GitlabSyncComponent, data: { titleI18n: 'title-gitlab' } },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule { }
