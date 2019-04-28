import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { dubboRequestSignature, DubboService, QueryDubboRequest } from 'app/api/service/dubbo.service'
import { DubboRequest } from 'app/model/es.model'
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd'

import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-project-dubbo-list',
  templateUrl: './project-dubbo-list.component.html',
})
export class ProjectDubboListComponent extends PageSingleModel implements OnInit {

  search: QueryDubboRequest = {}
  items: DubboRequest[] = []
  loading = false
  group: string
  project: string

  constructor(
    private dubboService: DubboService,
    private msgService: NzMessageService,
    private drawerService: NzDrawerService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { super() }

  loadData() {
    if (this.group && this.project) {
      this.loading = true
      this.dubboService.query({ group: this.group, project: this.project, ...this.search, ...this.toPageQuery() }).subscribe(res => {
        this.items = res.data.list
        this.pageTotal = res.data.total
        this.loading = false
      }, err => this.loading = false)
    }
  }

  getSignature(item: DubboRequest) {
    return dubboRequestSignature(item)
  }

  getRouter(item: DubboRequest) {
    return `/dubbo/${this.group}/${this.project}/${item._id}`
  }

  editItem(item: DubboRequest) {
    this.router.navigateByUrl(this.getRouter(item))
  }

  deleteItem(item: DubboRequest) {
    this.msgService.info('TBD')
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
