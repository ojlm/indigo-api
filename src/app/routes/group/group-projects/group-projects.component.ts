import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'
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
    private fb: FormBuilder,
    private groupService: GroupService,
    private projectService: ProjectService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { super() }

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
    }, err => this.loading = false)
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
