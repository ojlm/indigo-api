import { DOCUMENT } from '@angular/common'
import { Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2 } from '@angular/core'
import { ActivatedRoute, NavigationEnd, NavigationError, RouteConfigLoadStart, Router } from '@angular/router'
import { Menu, MenuService, ScrollService, SettingsService } from '@delon/theme'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'
import { SharedService } from '../../../api/service/shared.service'
import { Group } from '../../../model/es.model'
import { LayoutAbstractClass } from '../layout-abstract.class'

@Component({
  selector: 'layout-group',
  templateUrl: './layout-group.component.html',
})
export class LayoutGroupComponent extends LayoutAbstractClass {

  group: Group = {}

  constructor(
    router: Router,
    _message: NzMessageService,
    resolver: ComponentFactoryResolver,
    settings: SettingsService,
    el: ElementRef,
    renderer: Renderer2,
    @Inject(DOCUMENT) doc: any,
    scroll: ScrollService,
    menuSrv: MenuService,
    route: ActivatedRoute,
    private groupService: GroupService,
    sharedService: SharedService,
  ) {
    super(router, _message, resolver, settings, el, renderer, doc)
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
          text: '主导航',
          i18n: 'menu-main-navigation',
          group: true,
          hideInBreadcrumb: true,
          children: [
            {
              text: '项目列表',
              i18n: 'menu-projects',
              icon: { type: 'icon', value: 'database', theme: 'outline' },
              link: `/${group}`
            },
            {
              text: '任务列表',
              i18n: 'menu-jobs',
              icon: { type: 'icon', value: 'schedule', theme: 'outline' },
              link: `/group/${group}/jobs`
            },
            {
              text: '设置',
              i18n: 'menu-settings',
              icon: { type: 'icon', value: 'setting', theme: 'outline' },
              link: `/group/${group}/settings`,
              children: [
                {
                  text: '基本信息',
                  i18n: 'menu-general-info',
                  link: `/group/${group}/settings`,
                },
                {
                  text: '成员管理',
                  i18n: 'menu-members',
                  link: `/group/${group}/members`,
                },
                {
                  text: '其他选项',
                  i18n: 'menu-other-options',
                  link: `/group/${group}/options`,
                },
              ]
            }
          ]
        },
      ]
      menuSrv.add(menus)
    })
  }

  avatarText() {
    return this.groupService.getAvatarText(this.group)
  }

  toggleCollapsedSidebar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed)
  }
}
