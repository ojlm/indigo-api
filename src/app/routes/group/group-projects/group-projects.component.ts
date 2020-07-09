import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import { ProjectService, QueryProject } from '../../../api/service/project.service'
import { Project } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-group-projects',
  templateUrl: './group-projects.component.html',
})
export class GroupProjectsComponent extends PageSingleModel implements OnInit {

  groupId: string
  projects: Project[] = []
  loading = false
  search: QueryProject = {}

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
  ) { super() }

  avatarText(item: Project) {
    return this.projectService.getAvatarText(item)
  }

  goProject(item: Project) {
    this.router.navigateByUrl(`/${this.groupId}/${item.id}`)
  }

  goSettings(item: Project) {
    this.router.navigateByUrl(`/project/${this.groupId}/${item.id}/settings`)
  }

  loadData() {
    this.loading = true
    this.projectService.query({ group: this.groupId, ...this.toPageQuery(), ...this.search }).subscribe(res => {
      this.projects = res.data.list
      this.pageTotal = res.data.total
      this.loading = false
    }, _ => this.loading = false)
  }

  pageChange() {
    this.loadData()
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.groupId = param.get('group')
      this.loadData()
    })
  }
}
