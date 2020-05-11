import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { MonacoEditorModule } from 'ngx-monaco-editor'
import { SortablejsModule } from 'ngx-sortablejs'

import { DubboPlaygroundComponent } from './dubbo-playground/dubbo-playground.component'
import { DubboRoutingModule } from './dubbo-routing.module'

const COMPONENT = [
  DubboPlaygroundComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [
    CommonModule,
    MonacoEditorModule,
    SortablejsModule,
    SharedModule,
    DubboRoutingModule,
  ],
  exports: [...COMPONENT],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class DubboModule { }
