import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { JWTGuard } from '@delon/auth'
import { environment } from '@env/environment'

import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component'
import { LayoutIndigoComponent } from '../layout/indigo/indigo.component'
import { LayoutPassportComponent } from '../layout/passport/passport.component'
import { CallbackComponent } from './callback/callback.component'
import { Exception403Component } from './exception/403.component'
import { Exception404Component } from './exception/404.component'
import { Exception500Component } from './exception/500.component'
import { HomeComponent } from './home/home.component'
import { UserLockComponent } from './passport/lock/lock.component'
import { UserLoginComponent } from './passport/login/login.component'
import { UserRegisterResultComponent } from './passport/register-result/register-result.component'
import { UserRegisterComponent } from './passport/register/register.component'

const routes: Routes = [
  {
    path: '',
    component: LayoutIndigoComponent,
    canActivateChild: [JWTGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, data: { title: '主页' } },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' }
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
