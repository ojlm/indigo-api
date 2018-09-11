import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { ProjectService } from '../../../api/service/project.service'
import { Project } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent extends PageSingleModel implements OnInit {

  loading = false
  items: Project[] = []

  constructor(
    private projectService: ProjectService,
    private msg: NzMessageService,
    private router: Router,
  ) {
    super()
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
    this.projectService.query(this.toPageQuery()).subscribe(res => {
      this.items = res.data.list
      this.pageTotal = res.data.total
      this.loading = false
    }, err => this.loading = false)
  }

  pageChange() {
    this.loadData()
  }

  ngOnInit() {
    this.loadData()
  }
}
