import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core'
import { throwIfAlreadyLoaded } from '@core'
import { DelonACLModule } from '@delon/acl'
import { DelonMockModule } from '@delon/mock'
import { AlainThemeModule } from '@delon/theme'
import { ALAIN_CONFIG, AlainConfig } from '@delon/util'
import { environment } from '@env/environment'
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config'

import * as MOCKDATA from '../../_mock'

// Please refer to: https://ng-alain.com/docs/global-config
// #region NG-ALAIN Config

const alainConfig: AlainConfig = {
  st: { modal: { size: 'lg' } },
  pageHeader: { homeI18n: 'home' },
  lodop: {
    license: `A59B099A586B3851E0F0D7FDBF37B603`,
    licenseA: `C94CEE276DB2187AE6B65D56B3FC2848`,
  },
  auth: { login_url: '/passport/login', ignores: [/api\/user\/login/, /assets\//] },
}

const alainModules = [AlainThemeModule.forRoot(), DelonACLModule.forRoot(), DelonMockModule.forRoot()]
const alainProvides = [
  { provide: ALAIN_CONFIG, useValue: alainConfig }
]

// mock
if (!environment.production) {
  alainConfig.mock = { data: MOCKDATA }
}

// #region reuse-tab
/**
 * 若需要[路由复用](https://ng-alain.com/components/reuse-tab)需要：
 * 1、在 `shared-delon.module.ts` 导入 `ReuseTabModule` 模块
 * 2、注册 `RouteReuseStrategy`
 * 3、在 `src/app/layout/default/default.component.html` 修改：
 *  ```html
 *  <section class="alain-default__content">
 *    <reuse-tab #reuseTab></reuse-tab>
 *    <router-outlet (activate)="reuseTab.activate($event)"></router-outlet>
 *  </section>
 *  ```
 */
// import { RouteReuseStrategy } from '@angular/router';
// import { ReuseTabService, ReuseTabStrategy } from '@delon/abc/reuse-tab';
// alainProvides.push({
//   provide: RouteReuseStrategy,
//   useClass: ReuseTabStrategy,
//   deps: [ReuseTabService],
// } as any);

// #endregion

// #endregion

// Please refer to: https://ng.ant.design/docs/global-config/en#how-to-use
// #region NG-ZORRO Config

const ngZorroConfig: NzConfig = {}

const zorroProvides = [{ provide: NZ_CONFIG, useValue: ngZorroConfig }]

// #endregion

@NgModule({
  imports: [...alainModules],
})
export class GlobalConfigModule {
  constructor(@Optional() @SkipSelf() parentModule: GlobalConfigModule) {
    throwIfAlreadyLoaded(parentModule, 'GlobalConfigModule')
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GlobalConfigModule,
      providers: [...alainProvides, ...zorroProvides],
    }
  }
}
