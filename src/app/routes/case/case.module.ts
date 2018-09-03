import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { MonacoEditorModule } from 'ngx-monaco-editor'

import { CaseModelComponent } from './case-model/case-model.component'
import { CaseRoutingModule } from './case-routing.module'
import { MediaObjectComponent } from './media-object/media-object.component'

const COMPONENT = [
  CaseModelComponent,
  MediaObjectComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [CommonModule, MonacoEditorModule, SharedModule, CaseRoutingModule],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class CaseModule { }
