import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { MarkdownModule } from 'ngx-markdown'
import { MonacoEditorModule } from 'ngx-monaco-editor'
import { SortablejsModule } from 'ngx-sortablejs'

import { TopContentComponent } from './top-content/top-content.component'
import { TopHomeComponent } from './top-home/top-home.component'
import { TopRoutingModule } from './top-routing.module'
import { TopTopComponent } from './top-top/top-top.component'

const COMPONENT = [
  TopTopComponent,
  TopHomeComponent,
  TopContentComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [
    CommonModule,
    MarkdownModule.forChild(),
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
