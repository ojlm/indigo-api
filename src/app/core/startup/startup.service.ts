import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Injector } from '@angular/core'
import { ACLService } from '@delon/acl'
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth'
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme'
import { TranslateService } from '@ngx-translate/core'
import { NzIconService } from 'ng-zorro-antd'
import { zip } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { ICONS } from '../../../style-icons'
import { ICONS_AUTO } from '../../../style-icons-auto'
import { UserProfile } from '../../model/user.model'
import { I18NService } from '../i18n/i18n.service'

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private injector: Injector
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS)
  }

  private viaHttp(resolve: any, reject: any) {
    zip(
      this.httpClient.get(`assets/data/i18n/${this.i18n.defaultLang}.json`),
      this.httpClient.get('assets/data/app-data.json')
    ).pipe(
      // 接收其他拦截器后产生的异常消息
      catchError(([langData, appData]) => {
        resolve(null)
        return [langData, appData]
      })
    ).subscribe(([langData, appData]) => {
      // setting language data
      this.translate.setTranslation(this.i18n.defaultLang, langData)
      this.translate.setDefaultLang(this.i18n.defaultLang)

      // application data
      const res: any = appData
      // 应用信息：包括站点名、描述、年份
      this.settingService.setApp(res.app)
      // ACL：设置权限为全量
      this.aclService.setFull(true)
      // 初始化菜单
      // this.menuService.add(res.menu)
      // 设置页面标题的后缀
      this.titleService.suffix = res.app.name
    },
      () => { },
      () => {
        resolve(null)
      })
  }

  load(profile: UserProfile = null): Promise<any> {
    if (profile) {
      this.settingService.setUser(profile)
    }
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      this.viaHttp(resolve, reject)
    })
  }
}
