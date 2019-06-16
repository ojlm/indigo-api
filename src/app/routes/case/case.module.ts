import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { MonacoEditorModule } from 'ngx-monaco-editor'

import { CaseGeneratorComponent } from './case-generator/case-generator.component'
import { CaseHistoryComponent } from './case-history/case-history.component'
import { CaseModelComponent } from './case-model/case-model.component'
import { CaseRoutingModule } from './case-routing.module'
import { MediaObjectComponent } from './media-object/media-object.component'
import { ResultAssertComponent } from './result-assert/result-assert.component'

const COMPONENT = [
  CaseModelComponent,
  MediaObjectComponent,
  ResultAssertComponent,
  CaseHistoryComponent,
  CaseGeneratorComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [CommonModule, InfiniteScrollModule, MonacoEditorModule, SharedModule, CaseRoutingModule],
  exports: [...COMPONENT],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class CaseModule { }
