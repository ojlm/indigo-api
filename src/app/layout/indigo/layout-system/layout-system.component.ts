import { DOCUMENT } from '@angular/common'
import { Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2 } from '@angular/core'
import { NavigationEnd, NavigationError, RouteConfigLoadStart, Router } from '@angular/router'
import { Menu, MenuService, ScrollService, SettingsService, User } from '@delon/theme'
import { NzMessageService } from 'ng-zorro-antd'

import { LayoutAbstractClass } from '../layout-abstract.class'

@Component({
  selector: 'layout-system',
  templateUrl: './layout-system.component.html',
})
export class LayoutSystemComponent extends LayoutAbstractClass {

  user: User = {}

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
  ) {
    super(router, _message, resolver, settings, el, renderer, doc)
    this.user = this.settings.user
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
    menuSrv.clear()
    const menus: Menu[] = [
      {
        text: '主导航',
        i18n: 'menu-main-navigation',
        group: true,
        hideInBreadcrumb: true,
        children: [
          {
            text: '系统事件',
            i18n: 'item-activity',
            icon: { type: 'icon', value: 'database', theme: 'outline' },
            link: `/system`
          },
          {
            text: '总数',
            i18n: 'title-count',
            icon: { type: 'icon', value: 'stock', theme: 'outline' },
            link: `/system/count`
          },
          {
            text: 'Fund',
            i18n: 'title-fund',
            icon: { type: 'icon', value: 'fund', theme: 'outline' },
            link: `/system/fund`
          },
          {
            text: 'Trend',
            i18n: 'title-trend',
            icon: { type: 'icon', value: 'dot-chart', theme: 'outline' },
            link: `/system/trend`
          },
          {
            text: '系统设置',
            i18n: 'menu-sys-settings',
            open: true,
            icon: { type: 'icon', value: 'setting', theme: 'outline' },
            children: [
              {
                text: '报告数据索引',
                i18n: 'menu-job-report-data-indices',
                link: `/system/settings`,
              },
              {
                text: '系统任务',
                i18n: 'menu-system-jobs',
                link: `/system/jobs`,
              },
              {
                text: 'Gitlab',
                i18n: 'Gitlab',
                link: `/system/gitlab`,
              },
            ]
          }
        ]
      },
    ]
    menuSrv.add(menus)
  }

  avatarText() {
    if (this.user.nickname) {
      return this.user.nickname[0]
    } else {
      return this.user.username[0]
    }
  }

  toggleCollapsedSidebar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed)
  }
}
