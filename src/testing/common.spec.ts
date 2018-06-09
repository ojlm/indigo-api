// from: https://github.com/angular/angular/issues/12409
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { CUSTOM_ELEMENTS_SCHEMA, Type } from '@angular/core'
import { TestBed, TestModuleMetadata } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { I18NService } from '@core/i18n/i18n.service'
import { DelonAuthModule } from '@delon/auth'
import { _HttpClient, ALAIN_I18N_TOKEN, MenuService, ScrollService, SettingsService } from '@delon/theme'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { SharedModule } from '@shared/shared.module'

import { I18nHttpLoaderFactory } from '../app/app.module'
import { DelonModule } from '../app/delon.module'


const resetTestingModule = TestBed.resetTestingModule,
  preventAngularFromResetting = () =>
    (TestBed.resetTestingModule = () => TestBed)
const allowAngularToReset = () =>
  (TestBed.resetTestingModule = resetTestingModule)

export const setUpTestBed = (moduleDef: TestModuleMetadata) => {
  beforeAll(done =>
    (async () => {
      resetTestingModule()
      preventAngularFromResetting()

      // region: schemas
      if (!moduleDef.schemas) {
        moduleDef.schemas = []
      }
      moduleDef.schemas.push(CUSTOM_ELEMENTS_SCHEMA)
      // endregion

      // region: imports
      if (!moduleDef.imports) {
        moduleDef.imports = []
      }
      moduleDef.imports.push(RouterTestingModule)
      moduleDef.imports.push(HttpClientModule)
      moduleDef.imports.push(DelonModule)
      moduleDef.imports.push(SharedModule)
      // auth
      moduleDef.imports.push(DelonAuthModule.forRoot())
      // i18n
      moduleDef.imports.push(
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: I18nHttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      )
      // endregion

      // region: providers
      if (!moduleDef.providers) {
        moduleDef.providers = []
      }
      // i18n
      moduleDef.providers.push({
        provide: ALAIN_I18N_TOKEN,
        useClass: I18NService,
        multi: false,
      });
      // load full services
      [SettingsService, MenuService, ScrollService, _HttpClient].forEach(
        (item: any) => {
          if (moduleDef.providers.includes(item)) {
            return
          }
          moduleDef.providers.push(item)
        },
      )
      // endregion

      TestBed.configureTestingModule(moduleDef)
      await TestBed.compileComponents()

      // prevent Angular from resetting testing module
      TestBed.resetTestingModule = () => TestBed
    })()
      .then(done)
      .catch(done.fail))

  afterAll(() => allowAngularToReset())
}

/**
 * get service instance
 */
export const getService = <T>(type: Type<T>): T => <T>TestBed.get(type)
