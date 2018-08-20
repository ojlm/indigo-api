import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'

import { GroupProjectsComponent } from './group-projects/group-projects.component'
import { GroupRoutingModule } from './group-routing.module'

const COMPONENT = [
  GroupProjectsComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [CommonModule, SharedModule, GroupRoutingModule],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class GroupModule { }
