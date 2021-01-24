import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { GroupService } from 'app/api/service/group.service'
import { ProjectService } from 'app/api/service/project.service'
import { Group, Project } from 'app/model/es.model'
import { PageSingleModel } from 'app/model/page.model'

import { UiConfigService } from '../ui-config.service'

@Component({
  selector: 'app-ui-home',
  templateUrl: './ui-home.component.html',
  styleUrls: ['./ui-home.component.css']
})
export class UiHomeComponent extends PageSingleModel implements OnInit, AfterViewInit, OnDestroy {

  group = ''
  project = ''

  isCollapsed = false
  openMenu = {}
  selectMenu = {}

  // TODO page
  pageSize = 2000
  groups: Group[] = []
  groupProjects: { [k: string]: Project[] } = {}

  constructor(
    private uiConfigService: UiConfigService,
    private groupService: GroupService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
  ) {
    super()
    if (route.snapshot && route.snapshot.firstChild && route.snapshot.firstChild.params) {
      const params = route.snapshot.firstChild.params
      this.group = params['group']
      this.project = params['project']
      this.openMenu[this.group] = true
      this.selectMenu[this.group + this.project] = true
      if (this.route.snapshot.firstChild.firstChild) { // file route
        this.isCollapsed = true
      }
    }
    this.uiConfigService.menuCollapsedSubject.subscribe(val => {
      this.isCollapsed = val
    })
  }

  goProject(p: Project) {
    this.uiConfigService.goFiles(p.group, p.id)
  }

  openChange(open: boolean, group: Group) {
    if (!this.groupProjects[group.id]) {
      this.groupService.projects(group.id, { size: this.pageSize }).subscribe(res => {
        this.groupProjects[group.id] = res.data.list
        if (group.id === this.group && this.project) {
          const idx = this.groupProjects[group.id].findIndex(p => p.id === this.project)
          if (idx > -1) {
            delete this.group
            delete this.project
          }
        }
      })
    }
  }

  groupAvatar(g: Group) {
    return this.groupService.getAvatarText(g)
  }

  projectAvatar(p: Project) {
    return this.projectService.getAvatarText(p)
  }

  ngOnInit(): void {
    this.groupService.query(this.toPageQuery()).subscribe(res => {
      this.groups = res.data.list
      this.pageTotal = res.data.total
      if (this.group) {
        const idx = this.groups.findIndex(g => g.id === this.group)
        if (idx > -1) {
          this.openChange(true, this.groups[idx])
        }
      }
    })
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

}
