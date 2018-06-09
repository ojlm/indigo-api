import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { environment } from '@env/environment'
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component'
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component'
import { LayoutPassportComponent } from '../layout/passport/passport.component'
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component'
// passport pages
import { UserLoginComponent } from './passport/login/login.component'
import { UserRegisterComponent } from './passport/register/register.component'
import { UserRegisterResultComponent } from './passport/register-result/register-result.component'
// single pages
import { CallbackComponent } from './callback/callback.component'
import { UserLockComponent } from './passport/lock/lock.component'
import { Exception403Component } from './exception/403.component'
import { Exception404Component } from './exception/404.component'
import { Exception500Component } from './exception/500.component'

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardComponent, data: { title: '主页' } },
      // 业务子模块
      // { path: 'widgets', loadChildren: './widgets/widgets.module#WidgetsModule' }
    ]
  },
  // 全屏布局
  {
    path: 'fullscreen',
    component: LayoutFullScreenComponent,
    children: [
    ]
  },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      { path: 'login', component: UserLoginComponent, data: { title: '登录' } },
      { path: 'register', component: UserRegisterComponent, data: { title: '注册' } },
      { path: 'register-result', component: UserRegisterResultComponent, data: { title: '注册结果' } }
    ]
  },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: 'lock', component: UserLockComponent, data: { title: '锁屏' } },
  { path: '403', component: Exception403Component },
  { path: '404', component: Exception404Component },
  { path: '500', component: Exception500Component },
  { path: '**', redirectTo: 'home' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
