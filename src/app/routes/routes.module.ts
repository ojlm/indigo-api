import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'

import { CallbackComponent } from './callback/callback.component'
import { Exception403Component } from './exception/403.component'
import { Exception404Component } from './exception/404.component'
import { Exception500Component } from './exception/500.component'
import { GroupModelComponent } from './group/group-model/group-model.component'
import { GroupProjectsComponent } from './group/group-projects/group-projects.component'
import { HomeComponent } from './home/home.component'
import { UserLockComponent } from './passport/lock/lock.component'
import { UserLoginComponent } from './passport/login/login.component'
import { UserRegisterResultComponent } from './passport/register-result/register-result.component'
import { UserRegisterComponent } from './passport/register/register.component'
import { ProjectApiNewComponent } from './project/project-api-new/project-api-new.component'
import { ProjectApisComponent } from './project/project-apis/project-apis.component'
import { ProjectCasesComponent } from './project/project-cases/project-cases.component'
import { ProjectEnvModelComponent } from './project/project-env-model/project-env-model.component'
import { ProjectEnvsComponent } from './project/project-envs/project-envs.component'
import { ProjectModelComponent } from './project/project-model/project-model.component'
import { RouteRoutingModule } from './routes-routing.module'

const COMPONENTS = [
  HomeComponent,
  // passport pages
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  // single pages
  CallbackComponent,
  UserLockComponent,
  Exception403Component,
  Exception404Component,
  Exception500Component,
  // group
  GroupModelComponent,
  GroupProjectsComponent,
  // project
  ProjectModelComponent,
  ProjectApisComponent,
  ProjectApiNewComponent,
  ProjectCasesComponent,
  ProjectEnvsComponent,
  ProjectEnvModelComponent
]
const COMPONENTS_NOROUNT = []

@NgModule({
  imports: [SharedModule, RouteRoutingModule],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class RoutesModule { }
