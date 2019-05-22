import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { SortablejsModule } from 'angular-sortablejs'
import { MonacoEditorModule } from 'ngx-monaco-editor'

import { CaseModule } from '../case/case.module'
import { DubboModule } from '../dubbo/dubbo.module'
import { SqlModule } from '../sql/sql.module'
import { ScenarioModelComponent } from './scenario-model/scenario-model.component'
import { ScenarioRoutingModule } from './scenario-routing.module'
import { SelectStepComponent } from './select-step/select-step.component'
import { StepsRuntimeComponent } from './steps-runtime/steps-runtime.component'
import { StepsSelectorComponent } from './steps-selector/steps-selector.component'

const COMPONENT = [
  ScenarioModelComponent,
  StepsSelectorComponent,
  SelectStepComponent,
  StepsRuntimeComponent,
]

const COMPONENT_NOROUNT = [StepsRuntimeComponent]

@NgModule({
  imports: [
    CommonModule,
    MonacoEditorModule,
    SortablejsModule,
    SharedModule,
    ScenarioRoutingModule,
    CaseModule,
    DubboModule,
    SqlModule,
  ],
  exports: [...COMPONENT],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class ScenarioModule { }
