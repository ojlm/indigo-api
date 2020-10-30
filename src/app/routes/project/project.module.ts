import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { MonacoEditorModule } from 'ngx-monaco-editor'

import { ProjectMembersComponent } from './project-members/project-members.component'
import { ProjectOpenapiComponent } from './project-openapi/project-openapi.component'
import { ProjectOptionsComponent } from './project-options/project-options.component'
import { ProjectReportsComponent } from './project-reports/project-reports.component'
import { ProjectRoutingModule } from './project-routing.module'
import { ProjectSettingsComponent } from './project-settings/project-settings.component'
import { ProjectSyncSettingsComponent } from './project-sync-settings/project-sync-settings.component'

const COMPONENT = [
  ProjectSettingsComponent,
  ProjectOpenapiComponent,
  ProjectReportsComponent,
  ProjectOptionsComponent,
  ProjectSyncSettingsComponent,
  ProjectMembersComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [
    CommonModule,
    MonacoEditorModule,
    SharedModule,
    ProjectRoutingModule
  ],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class ProjectModule { }
