import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { NzLayoutModule } from 'ng-zorro-antd'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { MonacoEditorModule } from 'ngx-monaco-editor'
import { SortablejsModule } from 'ngx-sortablejs'

import { DriverConsoleComponent } from './driver-console/driver-console.component'
import { DriverStatusComponent } from './driver-status/driver-status.component'
import { KarateCommandComponent } from './karate-command/karate-command.component'
import { MonkeyCommandComponent } from './monkey-command/monkey-command.component'
import { NovncComponent } from './novnc/novnc.component'
import { UiActivityBarComponent } from './ui-activity-bar/ui-activity-bar.component'
import { UiActivityHistoryComponent } from './ui-activity-history/ui-activity-history.component'
import { UiActivityRunnerSolopiComponent } from './ui-activity-runner-solopi/ui-activity-runner-solopi.component'
import { UiActivityRunnerWebComponent } from './ui-activity-runner-web/ui-activity-runner-web.component'
import { UiActivityRunnerComponent } from './ui-activity-runner/ui-activity-runner.component'
import { UiDeviceInfoPreviewComponent } from './ui-device-info-preview/ui-device-info-preview.component'
import { UiFileAppKarateComponent } from './ui-file-app-karate/ui-file-app-karate.component'
import { UiFileAppRawComponent } from './ui-file-app-raw/ui-file-app-raw.component'
import { UiFileAppSolopiComponent } from './ui-file-app-solopi/ui-file-app-solopi.component'
import { UiFileContainerComponent } from './ui-file-container/ui-file-container.component'
import { UiFileNodesComponent } from './ui-file-nodes/ui-file-nodes.component'
import { UiFileTreeComponent } from './ui-file-tree/ui-file-tree.component'
import { UiFileComponent } from './ui-file/ui-file.component'
import { UiFolderDialogComponent } from './ui-folder-dialog/ui-folder-dialog.component'
import { UiHomeComponent } from './ui-home/ui-home.component'
import { UiLogEntryItemComponent } from './ui-log-entry-item/ui-log-entry-item.component'
import { UiLogEntryComponent } from './ui-log-entry/ui-log-entry.component'
import { UiMonkeyDialogComponent } from './ui-monkey-dialog/ui-monkey-dialog.component'
import { UiRoutingModule } from './ui-routing.module'
import { UiRunningJobComponent } from './ui-running-job/ui-running-job.component'
import { UiTaskReportComponent } from './ui-task-report/ui-task-report.component'
import { UiUploadDialogComponent } from './ui-upload-dialog/ui-upload-dialog.component'

const COMPONENT = [
  UiHomeComponent,
  UiRunningJobComponent,
  UiFileNodesComponent,
  UiFileComponent,
  UiFileTreeComponent,
  UiFolderDialogComponent,
  UiMonkeyDialogComponent,
  UiFileContainerComponent,
  UiFileTreeComponent,
  NovncComponent,
  MonkeyCommandComponent,
  DriverStatusComponent,
  DriverConsoleComponent,
  KarateCommandComponent,
  UiActivityBarComponent,
  UiActivityHistoryComponent,
  UiActivityRunnerComponent,
  UiTaskReportComponent,
  UiLogEntryComponent,
  UiLogEntryItemComponent,
  UiActivityRunnerWebComponent,
  UiUploadDialogComponent,
  UiFileAppKarateComponent,
  UiFileAppSolopiComponent,
  UiFileAppRawComponent,
  UiActivityRunnerSolopiComponent,
  UiDeviceInfoPreviewComponent,
]

const COMPONENT_NOROUNT = [
  UiFolderDialogComponent,
  UiUploadDialogComponent,
]

@NgModule({
  imports: [
    NzLayoutModule,
    CommonModule,
    MonacoEditorModule,
    SortablejsModule,
    InfiniteScrollModule,
    SharedModule,
    UiRoutingModule,
  ],
  exports: [...COMPONENT],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class UiModule { }
