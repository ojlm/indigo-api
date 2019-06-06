import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { SortablejsModule } from 'angular-sortablejs'
import { MonacoEditorModule } from 'ngx-monaco-editor'

import { TopRoutingModule } from './top-routing.module'
import { TopTopComponent } from './top-top/top-top.component'

const COMPONENT = [
  TopTopComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [
    CommonModule,
    MonacoEditorModule,
    SortablejsModule,
    SharedModule,
    TopRoutingModule,
  ],
  exports: [...COMPONENT],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class TopModule { }
