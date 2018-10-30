import { Component } from '@angular/core'
import { ActivatedRoute, NavigationEnd, NavigationError, RouteConfigLoadStart, Router } from '@angular/router'
import { Menu, MenuService, ScrollService, SettingsService } from '@delon/theme'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'
import { SharedService } from '../../../api/service/shared.service'
import { Group } from '../../../model/es.model'

@Component({
  selector: 'layout-group',
  templateUrl: './layout-group.component.html',
})
export class LayoutGroupComponent {
  isFetching = false
  group: Group = {}
  constructor(
    router: Router,
    scroll: ScrollService,
    private _message: NzMessageService,
    public menuSrv: MenuService,
    public settings: SettingsService,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private sharedService: SharedService,
  ) {
    sharedService.currentGroup.subscribe(group => this.group = group)
    // scroll to top in change page
    router.events.subscribe(evt => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true
      }
      if (evt instanceof NavigationError) {
        this.isFetching = false
        return
      }
      if (!(evt instanceof NavigationEnd)) {
        return
      }
      setTimeout(() => {
        scroll.scrollToTop()
        this.isFetching = false
      }, 100)
    })
    // set menu and group infomation
    route.paramMap.subscribe(param => {
      const group = param.get('group')
      const settingsUrl = `/group/${group}/settings`
      if (group && router.url !== settingsUrl) {
        groupService.getById(group).subscribe(
          res => sharedService.currentGroup.next(res.data),
          err => router.navigateByUrl('/')
        )
      }
      menuSrv.clear()
      const menus: Menu[] = [
        {
          'text': '主导航',
          'i18n': 'menu-main-navigation',
          'group': true,
          'hideInBreadcrumb': true,
          children: [
            {
              'text': '项目列表',
              'i18n': 'menu-projects',
              'icon': 'anticon antanticon anticon-database',
              'link': `/${group}`
            },
            {
              'text': '任务列表',
              'i18n': 'menu-jobs',
              'icon': 'anticon antanticon anticon-schedule',
              'link': `/group/${group}/jobs`
            },
            {
              'text': '设置',
              'i18n': 'menu-settings',
              'icon': 'anticon antanticon anticon-setting',
              'link': `/group/${group}/settings`,
              children: [
                {
                  'text': '基本信息',
                  'i18n': 'menu-general-info',
                  'link': `/group/${group}/settings`,
                },
                {
                  'text': '其他选项',
                  'i18n': 'menu-other-options',
                  'link': `/group/${group}/options`,
                }
              ]
            }
          ]
        },
      ]
      menuSrv.add(menus)
    })
  }

  toggleCollapsedSidebar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed)
  }
}
