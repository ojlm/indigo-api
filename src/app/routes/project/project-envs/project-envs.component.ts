import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { EnvService } from '../../../api/service/env.service'
import { Environment } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-project-envs',
  templateUrl: './project-envs.component.html',
})
export class ProjectEnvsComponent extends PageSingleModel implements OnInit {

  items: Environment[] = []
  loading = false
  group: string
  project: string

  constructor(
    private envService: EnvService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { super() }

  loadData() {
    if (this.group && this.project) {
      this.loading = true
      this.envService.query({ group: this.group, project: this.project, ...this.toPageQuery() }).subscribe(res => {
        this.items = res.data.list
        this.pageTotal = res.data.total
        this.loading = false
      }, err => this.loading = false)
    }
  }

  getRouter(item: Environment) {
    return `/env/${this.group}/${this.project}/${item._id}`
  }

  editItem(item: Environment) {
    this.router.navigateByUrl(this.getRouter(item))
  }

  pageChange() {
    this.loadData()
  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.loadData()
    })
  }
}
