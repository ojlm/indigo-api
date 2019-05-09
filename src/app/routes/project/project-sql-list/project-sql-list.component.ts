import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { QuerySqlRequest, sqlRequestSignature, SqlService } from 'app/api/service/sql.service'
import { ApiRes } from 'app/model/api.model'
import { SqlRequest } from 'app/model/es.model'
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-project-sql-list',
  templateUrl: './project-sql-list.component.html',
})
export class ProjectSqlListComponent extends PageSingleModel implements OnInit {

  search: QuerySqlRequest = {}
  searchPanelSubject: Subject<QuerySqlRequest> = new Subject<QuerySqlRequest>()
  querySubject: Subject<QuerySqlRequest>
  items: SqlRequest[] = []
  loading = false
  group: string
  project: string

  constructor(
    private sqlService: SqlService,
    private msgService: NzMessageService,
    private drawerService: NzDrawerService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    super()
    const response = new Subject<ApiRes<SqlRequest[]>>()
    this.querySubject = this.sqlService.newQuerySubject(response)
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

  getRouter(item: SqlRequest) {
    return `/sql/${this.group}/${this.project}/${item._id}`
  }

  editItem(item: SqlRequest) {
    this.router.navigateByUrl(this.getRouter(item))
  }

  deleteItem(item: SqlRequest) {
    this.msgService.info('TBD')
  }

  pageChange() {
    this.loadData()
  }

  getSqlRequestSignature(item: SqlRequest) {
    return sqlRequestSignature(item)
  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.loadData()
    })
  }
}
