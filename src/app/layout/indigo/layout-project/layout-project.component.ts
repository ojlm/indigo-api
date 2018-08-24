import { Component } from '@angular/core'
import { ActivatedRoute, NavigationEnd, NavigationError, RouteConfigLoadStart, Router } from '@angular/router'
import { Menu, MenuService, ScrollService, SettingsService } from '@delon/theme'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'
import { ProjectService } from '../../../api/service/project.service'
import { Project } from '../../../model/es.model'

@Component({
  selector: 'layout-project',
  templateUrl: './layout-project.component.html',
})
export class LayoutProjectComponent {

  isFetching = false
  project: Project = {}

  constructor(
    router: Router,
    scroll: ScrollService,
    private _message: NzMessageService,
    public menuSrv: MenuService,
    public settings: SettingsService,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private projectService: ProjectService
  ) {
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
      const project = param.get('project')
      if (project) {
        this.projectService.getById(group, project).subscribe(
          res => this.project = res.data,
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
              'text': '接口',
              'i18n': 'menu-apis',
              'icon': 'anticon antanticon anticon-api',
              children: [
                {
                  'text': '列表',
                  'i18n': 'menu-list',
                  'link': `/${group}/${project}`,
                },
                {
                  'text': '新建',
                  'i18n': 'menu-new',
                  'link': `/apis/${group}/${project}/new`,
                },
                {
                  'text': 'OpenApi',
                  'i18n': 'menu-openapi',
                  'link': `/apis/${group}/${project}/openapi`,
                },
              ]
            },
            {
              'text': '用例',
              'i18n': 'menu-cases',
              'icon': 'anticon antanticon anticon-book',
              children: [
                {
                  'text': '列表',
                  'i18n': 'menu-list',
                  'link': `/case/${group}/${project}`,
                },
                {
                  'text': '新建',
                  'i18n': 'menu-new',
                  'link': `/cases/${group}/${project}/new`,
                },
              ]
            },
            {
              'text': '场景',
              'i18n': 'menu-scenarios',
              'icon': 'anticon antanticon anticon-picture',
              children: [
                {
                  'text': '列表',
                  'i18n': 'menu-list',
                  'link': `/scenario/${group}/${project}`,
                },
                {
                  'text': '新建',
                  'i18n': 'menu-new',
                  'link': `/scenarios/${group}/${project}/new`,
                },
              ]
            },
            {
              'text': '任务',
              'i18n': 'menu-jobs',
              'icon': 'anticon antanticon anticon-schedule',
              'link': `/job/${group}/${project}`,
              children: [
                {
                  'text': '列表',
                  'i18n': 'menu-list',
                  'link': `/job/${group}/${project}`,
                },
                {
                  'text': '新建',
                  'i18n': 'menu-new',
                  'link': `/jobs/${group}/${project}/new`,
                },
              ]
            },
            {
              'text': '环境',
              'i18n': 'menu-envs',
              'icon': 'anticon antanticon anticon-environment-o',
              children: [
                {
                  'text': '列表',
                  'i18n': 'menu-list',
                  'link': `/env/${group}/${project}`,
                },
                {
                  'text': '新建',
                  'i18n': 'menu-new',
                  'link': `/envs/${group}/${project}/new`,
                },
              ]
            },
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
