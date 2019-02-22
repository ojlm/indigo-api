/**
 * 进一步对基础模块的导入提炼
 * 有关模块注册指导原则请参考：https://github.com/cipchk/ng-alain/issues/180
 */
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core'
import { throwIfAlreadyLoaded } from '@core/module-import-guard'
import { PageHeaderConfig } from '@delon/abc'
import { DelonAuthConfig } from '@delon/auth'
import { DelonMockModule } from '@delon/mock'
import { AlainThemeModule } from '@delon/theme'
import { environment } from '@env/environment'

import * as MOCKDATA from '../../_mock'

// mock
const MOCKMODULE = !environment.production ? [DelonMockModule.forRoot({ data: MOCKDATA })] : []

export function fnPageHeaderConfig(): PageHeaderConfig {
  return Object.assign(new PageHeaderConfig(), { home_i18n: 'home' })
}

export function fnDelonAuthConfig(): DelonAuthConfig {
  return Object.assign(new DelonAuthConfig(), <DelonAuthConfig>{
    login_url: '/passport/login',
    ignores: [/api\/user\/login/, /assets\//]
  })
}

const GLOBAL_CONFIG_PROVIDES = [
  { provide: PageHeaderConfig, useFactory: fnPageHeaderConfig },
  { provide: DelonAuthConfig, useFactory: fnDelonAuthConfig },
]

@NgModule({
  imports: [
    AlainThemeModule.forRoot(),
    // ...MOCKMODULE,
  ],
})
export class DelonModule {
  constructor(@Optional() @SkipSelf() parentModule: DelonModule, ) {
    throwIfAlreadyLoaded(parentModule, 'DelonModule')
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DelonModule,
      providers: [...GLOBAL_CONFIG_PROVIDES],
    }
  }
}
