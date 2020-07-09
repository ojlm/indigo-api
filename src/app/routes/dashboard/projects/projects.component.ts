import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { GroupService } from 'app/api/service/group.service'

import { ProjectService, QueryProject } from '../../../api/service/project.service'
import { Group, Project } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent extends PageSingleModel implements OnInit {

  loading = false
  items: Project[] = []
  groups: { [k: string]: Group } = {}
  search: QueryProject = {}

  constructor(
    private groupService: GroupService,
    private projectService: ProjectService,
    private router: Router,
  ) {
    super()
  }

  groupBreadcrumb(item: Project) {
    return this.groups[item.group] ? this.groupService.getBreadcrumb(this.groups[item.group]) : item.group
  }

  projectBreadcrumb(item: Project) {
    return this.projectService.getBreadcrumb(item)
  }

  projectAvatarText(item: Project) {
    return this.projectService.getAvatarText(item)
  }

  goGroup(item: Project) {
    this.router.navigateByUrl(`/${item.group}`)
  }

  goItem(item: Project) {
    this.router.navigateByUrl(`/${item.group}/${item.id}`)
  }

  goSettings(item: Project) {
    this.router.navigateByUrl(`/project/${item.group}/${item.id}/settings`)
  }

  loadData() {
    this.loading = true
    this.projectService.query({ ...this.toPageQuery(), ...this.search, includeGroup: true }).subscribe(res => {
      this.items = res.data.list
      this.groups = res.data.groups || {}
      this.pageTotal = res.data.total
      this.loading = false
    }, _ => this.loading = false)
  }

  pageChange() {
    this.loadData()
  }

  ngOnInit() {
    this.loadData()
  }
}
