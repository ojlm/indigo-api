import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'

import { JobReportIndicesComponent } from './job-report-indices/job-report-indices.component'
import { SystemPanelComponent } from './system-panel/system-panel.component'
import { SystemRoutingModule } from './system-routing.module'


const COMPONENT = [
  SystemPanelComponent,
  JobReportIndicesComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [CommonModule, SharedModule, SystemRoutingModule],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class SystemModule { }
