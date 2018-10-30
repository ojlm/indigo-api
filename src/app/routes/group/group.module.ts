import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'

import { GroupJobsComponent } from './group-jobs/group-jobs.component'
import { GroupOptionsComponent } from './group-options/group-options.component'
import { GroupRoutingModule } from './group-routing.module'
import { GroupSettingsComponent } from './group-settings/group-settings.component'

const COMPONENT = [
  GroupJobsComponent,
  GroupSettingsComponent,
  GroupOptionsComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [CommonModule, SharedModule, GroupRoutingModule],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class GroupModule { }
