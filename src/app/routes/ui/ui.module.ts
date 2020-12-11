import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { MonacoEditorModule } from 'ngx-monaco-editor'
import { SortablejsModule } from 'ngx-sortablejs'

import { DriverConsoleComponent } from './driver-console/driver-console.component'
import { DriverStatusComponent } from './driver-status/driver-status.component'
import { MonkeyCommandComponent } from './monkey-command/monkey-command.component'
import { NovncComponent } from './novnc/novnc.component'
import { UiRoutingModule } from './ui-routing.module'

const COMPONENT = [
  NovncComponent,
  MonkeyCommandComponent,
  DriverStatusComponent,
  DriverConsoleComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [
    CommonModule,
    MonacoEditorModule,
    SortablejsModule,
    SharedModule,
    UiRoutingModule,
  ],
  exports: [...COMPONENT],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class UiModule { }
