import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { DeleteItemComponent } from '@shared/delete-item/delete-item.component'
import { ApiRes } from 'app/model/api.model'
import { calcDrawerWidth } from 'app/util/drawer'
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CaseService, QueryCase } from '../../../api/service/case.service'
import { Case } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-project-cases',
  templateUrl: './project-cases.component.html',
})
export class ProjectCasesComponent extends PageSingleModel implements OnInit {

  form: FormGroup
  items: Case[] = []
  loading = false
  group: string
  project: string
  search: QueryCase = {}
  panelSubject: Subject<QueryCase> = new Subject<QueryCase>()
  querySubject: Subject<QueryCase>

  constructor(
    private caseService: CaseService,
    private msgService: NzMessageService,
    private drawerService: NzDrawerService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    super()
    const response = new Subject<ApiRes<Case[]>>()
    this.querySubject = this.caseService.newQuerySubject(response)
    response.subscribe(res => {
      this.loading = false
      if (res) {
        this.items = res.data.list
        this.pageTotal = res.data.total
      }
    })
    this.panelSubject.subscribe(search => {
      this.loadData()
    })
  }

  loadData() {
    if (this.group && this.project) {
      this.loading = true
      this.querySubject.next({ group: this.group, project: this.project, ...this.toPageQuery(), ...this.search })
    }
  }

  methodTagColor(item: Case) {
    switch (item.request.method) {
      case 'GET':
        return 'green'
      case 'DELETE':
        return 'red'
      case 'POST':
        return 'cyan'
      case 'PUT':
        return 'blue'
      default:
        return 'purple'
    }
  }

  getRouter(item: Case) {
    return `/case/${this.group}/${this.project}/${item._id}`
  }

  editItem(item: Case) {
    this.router.navigateByUrl(this.getRouter(item))
  }

  deleteItem(item: Case) {
    const drawerRef = this.drawerService.create({
      nzTitle: item.summary,
      nzContent: DeleteItemComponent,
      nzContentParams: {
        data: {
          type: 'case',
          value: item
        }
      },
      nzBodyStyle: {
        'padding': '8px'
      },
      nzWidth: calcDrawerWidth(0.33)
    })
    drawerRef.afterClose.subscribe(data => {
      if (data) {
        this.loadData()
      }
    })
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
