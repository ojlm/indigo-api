import { HttpClient, HttpClientModule } from '@angular/common/http'
import { inject, TestBed } from '@angular/core/testing'
import { SettingsService } from '@delon/theme'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { SharedModule } from '@shared/shared.module'

import { I18nHttpLoaderFactory } from '../../app.module'
import { DelonModule } from '../../delon.module'
import { I18NService } from './i18n.service'

describe('Service: I18n', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        DelonModule,
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: I18nHttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      providers: [I18NService, SettingsService],
    })
  })

  it(
    'should create an instance',
    inject([I18NService], (service: I18NService) => {
      expect(service).toBeTruthy()
    }),
  )
})
