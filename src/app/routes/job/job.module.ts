import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { MonacoEditorModule } from 'ngx-monaco-editor'

import { CaseModule } from '../case/case.module'
import { JobModelComponent } from './job-model/job-model.component'
import { JobRoutingModule } from './job-routing.module'

const COMPONENT = [
  JobModelComponent
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [
    CommonModule,
    MonacoEditorModule,
    SharedModule,
    JobRoutingModule,
    CaseModule
  ],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class JobModule { }
