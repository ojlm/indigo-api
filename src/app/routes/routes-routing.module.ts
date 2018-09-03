import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { JWTGuard } from '@delon/auth'
import { environment } from '@env/environment'

import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component'
import { LayoutGroupComponent } from '../layout/indigo/layout-group/layout-group.component'
import { LayoutIndigoComponent } from '../layout/indigo/layout-indigo/layout-indigo.component'
import { LayoutProjectComponent } from '../layout/indigo/layout-project/layout-project.component'
import { LayoutPassportComponent } from '../layout/passport/passport.component'
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

const routes: Routes = [
  {
    path: '',
    component: LayoutIndigoComponent,
    canActivateChild: [JWTGuard],
    children: [
      { path: '', component: HomeComponent, data: { titleI18n: 'title-home' } },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'groups/new', component: GroupModelComponent, data: { titleI18n: 'title-group-new' } },
      { path: 'projects/new', component: ProjectModelComponent, data: { titleI18n: 'title-project-new' } }
    ]
  },
  // 全屏布局
  {
    path: 'fullscreen',
    canActivate: [JWTGuard],
    component: LayoutFullScreenComponent,
    children: [
    ]
  },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      { path: 'login', component: UserLoginComponent, data: { titleI18n: 'title-login' } },
      { path: 'register', component: UserRegisterComponent, data: { titleI18n: 'title-register' } },
      { path: 'register-result', component: UserRegisterResultComponent, data: { titleI18n: 'title-register-result' } }
    ]
  },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: 'lock', component: UserLockComponent, data: { titleI18n: 'title-lock' } },
  { path: '403', component: Exception403Component },
  { path: '404', component: Exception404Component },
  { path: '500', component: Exception500Component },
  {
    path: 'apis/:group/:project/new', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: ProjectApiNewComponent, data: { titleI18n: 'title-api-new' } }
    ]
  },
  {
    path: 'case/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: ProjectCasesComponent, data: { titleI18n: 'title-case-list' } },
      { path: ':id', loadChildren: './case/case.module#CaseModule' }
    ]
  },
  {
    path: 'cases/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', loadChildren: './case/case.module#CaseModule' }
    ]
  },
  {
    path: 'env/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: ProjectEnvsComponent, data: { titleI18n: 'title-env-list' } },
      { path: ':id', loadChildren: './case/case.module#CaseModule' }
    ]
  },
  {
    path: 'envs/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: 'new', component: ProjectEnvModelComponent, data: { titleI18n: 'title-env-new' } }
    ]
  },
  // group layout
  {
    path: ':group', component: LayoutGroupComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: GroupProjectsComponent, data: { titleI18n: 'title-groups' } }
    ]
  },
  // project layout
  {
    path: ':group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: ProjectApisComponent, data: { titleI18n: 'title-projects' } }
    ]
  },
  {
    path: 'project/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', loadChildren: './project/project.module#ProjectModule' }
    ]
  },
  {
    path: 'group/:group', component: LayoutGroupComponent, canActivateChild: [JWTGuard], children: [
      { path: '', loadChildren: './group/group.module#GroupModule' },
    ]
  },
  { path: '**', redirectTo: '' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
