import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { JWTGuard } from '@delon/auth'
import { environment } from '@env/environment'
import { EnvModelComponent } from '@shared/env-model/env-model.component'

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
import { Home2Component } from './home/home2/home2.component'
import { UserLoginComponent } from './passport/login/login.component'
import { ProjectApiNewComponent } from './project/project-api-new/project-api-new.component'
import { ProjectCasesComponent } from './project/project-cases/project-cases.component'
import { ProjectCiCdListComponent } from './project/project-cicd-list/project-cicd-list.component'
import { ProjectDubboListComponent } from './project/project-dubbo-list/project-dubbo-list.component'
import { ProjectEnvsComponent } from './project/project-envs/project-envs.component'
import { ProjectJobsComponent } from './project/project-jobs/project-jobs.component'
import { ProjectModelComponent } from './project/project-model/project-model.component'
import { ProjectScenariosComponent } from './project/project-scenarios/project-scenarios.component'
import { ProjectSqlListComponent } from './project/project-sql-list/project-sql-list.component'

const routes: Routes = [
  {
    path: '',
    component: LayoutIndigoComponent,
    canActivateChild: [JWTGuard],
    children: [
      // { path: '', redirectTo: 'dashboard/groups', pathMatch: 'full', data: { titleI18n: 'title-home' } },
      { path: '', component: Home2Component, data: { titleI18n: 'title-home' } },
      { path: 'toptop', loadChildren: () => import('./top/top.module').then(m => m.TopModule) },
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'groups/new', component: GroupModelComponent, data: { titleI18n: 'title-group-new' } },
      { path: 'projects/new', component: ProjectModelComponent, data: { titleI18n: 'title-project-new' } }
    ]
  },
  {
    path: 'cluster',
    component: LayoutIndigoComponent,
    canActivateChild: [JWTGuard],
    children: [
      { path: '', loadChildren: () => import('./cluster/cluster.module').then(m => m.ClusterModule) }
    ]
  },
  {
    path: 'dubbo',
    component: LayoutIndigoComponent,
    canActivateChild: [JWTGuard],
    children: [
      { path: '', loadChildren: () => import('./dubbo/dubbo.module').then(m => m.DubboModule) }
    ]
  },
  {
    path: 'system',
    component: LayoutIndigoComponent,
    canActivateChild: [JWTGuard],
    children: [
      { path: '', loadChildren: () => import('./system/system.module').then(m => m.SystemModule) }
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
    ]
  },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
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
      { path: '', loadChildren: () => import('./case/case.module').then(m => m.CaseModule) }
    ]
  },
  {
    path: 'case/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: ':caseId', loadChildren: () => import('./case/case.module').then(m => m.CaseModule) }
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
      { path: ':jobId', loadChildren: () => import('./job/job.module').then(m => m.JobModule) }
    ]
  },
  {
    path: 'jobs/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: 'new', loadChildren: () => import('./job/job.module').then(m => m.JobModule) }
    ]
  },
  {
    path: 'scenario/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: ProjectScenariosComponent, data: { titleI18n: 'title-scenario-list' } },
      { path: ':scenarioId', loadChildren: () => import('./scenario/scenario.module').then(m => m.ScenarioModule) }
    ]
  },
  {
    path: 'scenarios/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: 'new', loadChildren: () => import('./scenario/scenario.module').then(m => m.ScenarioModule) }
    ]
  },
  {
    path: 'dubbo/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: ProjectDubboListComponent, data: { titleI18n: 'title-dubbo-list' } },
      { path: ':dubboId', loadChildren: () => import('./dubbo/dubbo.module').then(m => m.DubboModule) }
    ]
  },
  {
    path: 'dubboes/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: 'new', loadChildren: () => import('./dubbo/dubbo.module').then(m => m.DubboModule) }
    ]
  },
  {
    path: 'sql/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: ProjectSqlListComponent, data: { titleI18n: 'title-sql-list' } },
      { path: ':sqlId', loadChildren: () => import('./sql/sql.module').then(m => m.SqlModule) }
    ]
  },
  {
    path: 'sqls/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: 'new', loadChildren: () => import('./sql/sql.module').then(m => m.SqlModule) }
    ]
  },
  {
    path: 'ci/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: ProjectCiCdListComponent, data: { titleI18n: 'title-cicd-list' } },
      { path: ':ciId', loadChildren: () => import('./ci/ci.module').then(m => m.CiModule) }
    ]
  },
  {
    path: 'cis/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', loadChildren: () => import('./ci/ci.module').then(m => m.CiModule) }
    ]
  },
  {
    path: ':group', component: LayoutGroupComponent, canActivateChild: [JWTGuard], children: [
      { path: '', component: GroupProjectsComponent, data: { titleI18n: 'title-groups' } }
    ]
  },
  {
    path: 'project/:group/:project', component: LayoutProjectComponent, canActivateChild: [JWTGuard], children: [
      { path: '', loadChildren: () => import('./project/project.module').then(m => m.ProjectModule) }
    ]
  },
  {
    path: 'group/:group', component: LayoutGroupComponent, canActivateChild: [JWTGuard], children: [
      { path: '', loadChildren: () => import('./group/group.module').then(m => m.GroupModule) },
    ]
  },
  {
    path: 'report/job/:group/:project', component: LayoutFullScreenComponent, canActivateChild: [JWTGuard], children: [
      { path: ':reportId', loadChildren: () => import('./report/report.module').then(m => m.ReportModule) },
    ]
  },
  { path: '**', redirectTo: '' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: environment.useHash,
    // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
    // Pls refer to https://ng-alain.com/components/reuse-tab
    scrollPositionRestoration: 'top',
  })],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
