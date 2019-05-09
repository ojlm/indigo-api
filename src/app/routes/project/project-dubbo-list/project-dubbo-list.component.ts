import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { dubboRequestSignature, DubboService, QueryDubboRequest } from 'app/api/service/dubbo.service'
import { ApiRes } from 'app/model/api.model'
import { DubboRequest } from 'app/model/es.model'
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-project-dubbo-list',
  templateUrl: './project-dubbo-list.component.html',
})
export class ProjectDubboListComponent extends PageSingleModel implements OnInit {

  search: QueryDubboRequest = {}
  searchPanelSubject: Subject<QueryDubboRequest> = new Subject<QueryDubboRequest>()
  querySubject: Subject<QueryDubboRequest>
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
  ) {
    super()
    const response = new Subject<ApiRes<DubboRequest[]>>()
    this.querySubject = this.dubboService.newQuerySubject(response)
    response.subscribe(res => {
      this.loading = false
      this.items = res.data.list
      this.pageTotal = res.data.total
    }, err => this.loading = false)
    this.searchPanelSubject.subscribe(search => {
      this.loadData()
    })
  }

  loadData() {
    if (this.group && this.project) {
      this.loading = true
      this.querySubject.next({ group: this.group, project: this.project, ...this.search, ...this.toPageQuery() })
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
