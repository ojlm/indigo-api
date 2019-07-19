import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { SortablejsModule } from 'angular-sortablejs'
import { MonacoEditorModule } from 'ngx-monaco-editor'

import { CiEventComponent } from './ci-event/ci-event.component'
import { CiRoutingModule } from './ci-routing.module'

const COMPONENT = [
  CiEventComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [
    CommonModule,
    MonacoEditorModule,
    SortablejsModule,
    SharedModule,
    CiRoutingModule,
  ],
  exports: [...COMPONENT],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class CiModule { }
