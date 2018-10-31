import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { DeleteItemComponent } from '@shared/delete-item/delete-item.component'
import { ApiRes } from 'app/model/api.model'
import { UserProfile } from 'app/model/user.model'
import { calcDrawerWidth } from 'app/util/drawer'
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CaseService, QueryCase } from '../../../api/service/case.service'
import { Case } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-project-cases',
  templateUrl: './project-cases.component.html',
  styles: [`
    .user-info {
      float: right;
      opacity: 0.5;
    }
    .user-info:hover {
      float: right;
      opacity: 1;
    }
  `]
})
export class ProjectCasesComponent extends PageSingleModel implements OnInit {

  form: FormGroup
  items: Case[] = []
  users: { [k: string]: UserProfile } = {}
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
        const newUser = res.data['creators'] || {}
        for (const k of Object.keys(newUser)) {
          this.users[k] = newUser[k]
        }
      }
    })
    this.panelSubject.subscribe(search => {
      this.loadData()
    })
  }

  loadData() {
    if (this.group && this.project) {
      this.loading = true
      this.querySubject.next({ group: this.group, project: this.project, ...this.toPageQuery(), ...this.search, hasCreators: true })
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

  userText(item: Case) {
    const profile = this.users[item.creator]
    if (profile) {
      return (profile.nickname || profile.username)[0]
    } else {
      return ''
    }
  }

  userAvatar(item: Case) {
    const profile = this.users[item.creator]
    if (profile) {
      return profile.avatar
    } else {
      return ''
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
