import { registerLocaleData } from '@angular/common'
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http'
import ngLang from '@angular/common/locales/zh'
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CoreModule } from '@core/core.module'
import { I18NService } from '@core/i18n/i18n.service'
import { DefaultInterceptor } from '@core/net/default.interceptor'
import { StartupService } from '@core/startup/startup.service'
import { JWTInterceptor } from '@delon/auth'
import { ALAIN_I18N_TOKEN, DELON_LOCALE, zh_CN as delonLang } from '@delon/theme'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { JsonSchemaModule } from '@shared/json-schema/json-schema.module'
import { SharedModule } from '@shared/shared.module'
import { SortablejsModule } from 'angular-sortablejs'
import { NZ_I18N, zh_CN as zorroLang } from 'ng-zorro-antd'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { MarkdownModule } from 'ngx-markdown'
import { MonacoEditorModule } from 'ngx-monaco-editor'

import { AppComponent } from './app.component'
import { DelonModule } from './delon.module'
import { LayoutModule } from './layout/layout.module'
import { RoutesModule } from './routes/routes.module'

// #region default language
// 参考：https://ng-alain.com/docs/i18n
const LANG = {
  abbr: 'zh',
  ng: ngLang,
  zorro: zorroLang,
  delon: delonLang,
}
// register angular
registerLocaleData(LANG.ng, LANG.abbr)
const LANG_PROVIDES = [
  { provide: LOCALE_ID, useValue: LANG.abbr },
  { provide: NZ_I18N, useValue: LANG.zorro },
  { provide: DELON_LOCALE, useValue: LANG.delon },
]
// #endregion

// #region i18n services
export function I18nHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `assets/data/i18n/`, '.json')
}

const I18NSERVICE_MODULES = [
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: I18nHttpLoaderFactory,
      deps: [HttpClient]
    }
  })
]

const I18NSERVICE_PROVIDES = [
  { provide: ALAIN_I18N_TOKEN, useClass: I18NService, multi: false }
]
// #region

// #region JSON Schema form (using @delon/form)
const FORM_MODULES = [JsonSchemaModule]
// #endregion

// #region Http Interceptors
const INTERCEPTOR_PROVIDES = [
  { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
]
// #endregion

// #region global third module
const GLOBAL_THIRD_MODULES = [
  InfiniteScrollModule,
  SortablejsModule.forRoot({ animation: 150 }),
  MonacoEditorModule.forRoot(),
  MarkdownModule.forRoot()
]
// #endregion

// #region Startup Service
export function StartupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load()
}
const APPINIT_PROVIDES = [
  StartupService,
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true
  }
]
// #endregion

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DelonModule.forRoot(),
    CoreModule,
    SharedModule,
    LayoutModule,
    RoutesModule,
    ...I18NSERVICE_MODULES,
    ...FORM_MODULES,
    ...GLOBAL_THIRD_MODULES,
  ],
  providers: [
    ...LANG_PROVIDES,
    ...INTERCEPTOR_PROVIDES,
    ...I18NSERVICE_PROVIDES,
    ...APPINIT_PROVIDES,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
