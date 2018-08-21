import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'

import { ProjectRoutingModule } from './project-routing.module'
import { ProjectSettingsComponent } from './project-settings/project-settings.component'


const COMPONENT = [
  ProjectSettingsComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [CommonModule, SharedModule, ProjectRoutingModule],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class ProjectModule { }
