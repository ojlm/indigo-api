import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { JWTGuard } from '@delon/auth'
import { environment } from '@env/environment'
import { EnvModelComponent } from '@shared/env-model/env-model.component'
import { RestModelComponent } from '@shared/rest-model/rest-model.component'

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
import { ProjectEnvsComponent } from './project/project-envs/project-envs.component'
import { ProjectJobsComponent } from './project/project-jobs/project-jobs.component'
import { ProjectModelComponent } from './project/project-model/project-model.component'
import { ProjectScenariosComponent } from './project/project-scenarios/project-scenarios.component'

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
    path: ':group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: ProjectCasesComponent, data: { titleI18n: 'title-case-list' } }
    ]
  },
  {
    path: 'cases/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: 'new', loadChildren: './case/case.module#CaseModule' }
    ]
  },
  {
    path: 'case/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: ':caseId', loadChildren: './case/case.module#CaseModule' }
    ]
  },
  {
    path: 'rest/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: ProjectApisComponent, data: { titleI18n: 'title-projects' } },
      { path: ':restId', component: RestModelComponent, data: { titleI18n: 'title-rest' } }
    ]
  },
  {
    path: 'apis/:group/:project/new', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: ProjectApiNewComponent, data: { titleI18n: 'title-api-new' } }
    ]
  },
  {
    path: 'env/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: ProjectEnvsComponent, data: { titleI18n: 'title-env-list' } },
      { path: ':envId', component: EnvModelComponent, data: { titleI18n: 'title-env' } }
    ]
  },
  {
    path: 'envs/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: 'new', component: EnvModelComponent, data: { titleI18n: 'title-env-new' } }
    ]
  },
  {
    path: 'job/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: ProjectJobsComponent, data: { titleI18n: 'title-job-list' } },
      { path: ':jobId', loadChildren: './job/job.module#JobModule' }
    ]
  },
  {
    path: 'jobs/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: 'new', loadChildren: './job/job.module#JobModule' }
    ]
  },
  {
    path: 'scenario/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: ProjectScenariosComponent, data: { titleI18n: 'title-scenario-list' } },
      { path: ':scenarioId', loadChildren: './scenario/scenario.module#ScenarioModule' }
    ]
  },
  {
    path: 'scenarios/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: 'new', loadChildren: './scenario/scenario.module#ScenarioModule' }
    ]
  },
  {
    path: ':group', component: LayoutGroupComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: GroupProjectsComponent, data: { titleI18n: 'title-groups' } }
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
  {
    path: 'report/job/:group/:project', component: LayoutFullScreenComponent, canActivateChild: [JWTGuard], children: [
      { path: ':reportId', loadChildren: './report/report.module#ReportModule' },
    ]
  },
  { path: '**', redirectTo: '' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
