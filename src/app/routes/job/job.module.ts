import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { MonacoEditorModule } from 'ngx-monaco-editor'

import { CaseModule } from '../case/case.module'
import { ScenarioModule } from '../scenario/scenario.module'
import { CaseSelectorComponent } from './case-selector/case-selector.component'
import { JobModelComponent } from './job-model/job-model.component'
import { JobRoutingModule } from './job-routing.module'
import { JobTriggerComponent } from './job-trigger/job-trigger.component'
import { ScenarioSelectorComponent } from './scenario-selector/scenario-selector.component'

const COMPONENT = [
  JobModelComponent,
  CaseSelectorComponent,
  JobTriggerComponent,
  ScenarioSelectorComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [
    CommonModule,
    MonacoEditorModule,
    SharedModule,
    JobRoutingModule,
    CaseModule,
    ScenarioModule,
  ],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class JobModule { }
