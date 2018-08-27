import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'

import { CaseModelComponent } from './case-model/case-model.component'
import { CaseRoutingModule } from './case-routing.module'

const COMPONENT = [
  CaseModelComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [CommonModule, SharedModule, CaseRoutingModule],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class CaseModule { }
