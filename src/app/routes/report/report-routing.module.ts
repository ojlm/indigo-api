import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { JobReportModelComponent } from './job-report-model/job-report-model.component'

const routes: Routes = [
  { path: '', component: JobReportModelComponent, data: { titleI18n: 'title-job-report' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule { }
