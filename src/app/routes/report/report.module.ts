import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { MonacoEditorModule } from 'ngx-monaco-editor'

import { ScenarioModule } from '../scenario/scenario.module'
import { JobReportItemComponent } from './job-report-item/job-report-item.component'
import { JobReportModelComponent } from './job-report-model/job-report-model.component'
import { ReportRoutingModule } from './report-routing.module'

const COMPONENT = [
  JobReportModelComponent,
  JobReportItemComponent,
]

const COMPONENT_NOROUNT = [
  JobReportItemComponent,
]

@NgModule({
  imports: [
    CommonModule,
    MonacoEditorModule,
    SharedModule,
    ReportRoutingModule,
    NgxChartsModule,
    ScenarioModule
  ],
  exports: [...COMPONENT],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class ReportModule { }
