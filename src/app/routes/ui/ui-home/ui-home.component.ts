import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { GroupService } from 'app/api/service/group.service'
import { Group, GroupProject, Project } from 'app/model/es.model'
import { PageSingleModel } from 'app/model/page.model'

import { UiConfigService } from '../ui-config.service'

@Component({
  selector: 'app-ui-home',
  templateUrl: './ui-home.component.html',
  styleUrls: ['./ui-home.component.css']
})
export class UiHomeComponent extends PageSingleModel implements OnInit, AfterViewInit, OnDestroy {

  openMenu = {}
  selectMenu = {}
  intiParams: GroupProject = {}
  // TODO page
  pageSize = 2000
  groups: Group[] = []
  groupProjects: { [k: string]: Project[] } = {}

  constructor(
    private uiConfigService: UiConfigService,
    private groupService: GroupService,
    private route: ActivatedRoute,
  ) {
    super()
    if (route.snapshot && route.snapshot.firstChild && route.snapshot.firstChild.params) {
      this.intiParams = { ...route.snapshot.firstChild.params }
      this.openMenu[this.intiParams.group] = true
      this.selectMenu[this.intiParams.group + this.intiParams.project] = true
    }
  }

  goProject(p: Project) {
    this.uiConfigService.goFiles(p.group, p.id)
  }

  openChange(open: boolean, group: Group) {
    if (!this.groupProjects[group.id]) {
      this.groupService.projects(group.id, { size: this.pageSize }).subscribe(res => {
        this.groupProjects[group.id] = res.data.list
        if (group.id === this.intiParams.group && this.intiParams.project) {
          const idx = this.groupProjects[group.id].findIndex(p => p.id === this.intiParams.project)
          if (idx > -1) {
            delete this.intiParams.group
            delete this.intiParams.project
          }
        }
      })
    }
  }

  ngOnInit(): void {
    this.groupService.query(this.toPageQuery()).subscribe(res => {
      this.groups = res.data.list
      this.pageTotal = res.data.total
      if (this.intiParams.group) {
        const idx = this.groups.findIndex(g => g.id === this.intiParams.group)
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
