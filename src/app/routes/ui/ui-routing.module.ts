import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { JWTGuard } from '@delon/auth'
import { LayoutFullScreenComponent } from 'app/layout/fullscreen/fullscreen.component'

import { UiFileContainerComponent } from './ui-file-container/ui-file-container.component'
import { UiFileNodesComponent } from './ui-file-nodes/ui-file-nodes.component'
import { UiFileComponent } from './ui-file/ui-file.component'
import { UiHomeComponent } from './ui-home/ui-home.component'
import { UiRunningJobComponent } from './ui-running-job/ui-running-job.component'
import { UiTaskReportComponent } from './ui-task-report/ui-task-report.component'

const routes: Routes = [
  {
    path: '',
    data: { titleI18n: 'title-ui' },
    canActivate: [JWTGuard],
    component: UiHomeComponent,
    children: [
      { path: '', component: UiRunningJobComponent },
      { path: ':group/:project/files', component: UiFileNodesComponent },
      {
        path: ':group/:project/file',
        component: UiFileContainerComponent,
        children: [
          { path: ':fileId', component: UiFileComponent }
        ]
      },
    ]
  },
  {
    path: 'report',
    data: { titleI18n: 'title-ui' },
    canActivate: [JWTGuard],
    component: LayoutFullScreenComponent,
    children: [
      { path: ':group/:project/:reportId', component: UiTaskReportComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UiRoutingModule { }
