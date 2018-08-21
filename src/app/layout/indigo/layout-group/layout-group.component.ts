import { Component } from '@angular/core'
import { ActivatedRoute, NavigationEnd, NavigationError, RouteConfigLoadStart, Router } from '@angular/router'
import { Menu, MenuService, ScrollService, SettingsService } from '@delon/theme'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'
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
  ) {
    // scroll to top in change page
    router.events.subscribe(evt => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true
      }
      if (evt instanceof NavigationError) {
        this.isFetching = false
        _message.error(`无法加载${evt.url}路由`, { nzDuration: 1000 * 3 })
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
      const groupId = param.get('group')
      groupService.getById(groupId).subscribe(res => this.group = res.data)
      menuSrv.clear()
      const menus: Menu[] = [
        {
          'text': '主导航',
          'i18n': 'menu-main-navigation',
          'group': true,
          'hideInBreadcrumb': true,
          children: [
            {
              'text': '项目',
              'i18n': 'menu-projects',
              'icon': 'anticon antanticon anticon-database',
              'link': `/${groupId}`
            },
            {
              'text': '任务',
              'i18n': 'menu-jobs',
              'icon': 'anticon antanticon anticon-schedule',
              'link': `/group/${groupId}/jobs`
            },
            {
              'text': '设置',
              'i18n': 'menu-settings',
              'icon': 'anticon antanticon anticon-setting',
              'link': `/group/${groupId}/settings`
            }
          ]
        },
      ]
      menuSrv.add(menus)
    })
  }
}
