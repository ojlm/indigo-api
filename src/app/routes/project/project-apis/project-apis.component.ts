import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { ApiService } from '../../../api/service/api.service'
import { Api } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-project-apis',
  templateUrl: './project-apis.component.html',
})
export class ProjectApisComponent extends PageSingleModel implements OnInit {

  avatar = ''
  form: FormGroup
  apis: Api[] = []
  loading = false
  group: string
  project: string

  constructor(
    private apiService: ApiService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { super() }

  loadData() {
    if (this.group && this.project) {
      this.loading = true
      this.apiService.query({ group: this.group, project: this.project, ...this.toPageQuery() }).subscribe(res => {
        this.apis = res.data.list
        this.pageTotal = res.data.total
        this.loading = false
      }, err => this.loading = false)
    }
  }

  apiRouter(api: Api) {
    return `/api/${this.group}/${this.project}/${api._id}`
  }

  methodTagColor(item: Api) {
    switch (item.method) {
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

  goSettings(api: Api) {
    this.router.navigateByUrl(this.apiRouter(api))
  }

  editItem(api: Api) {
    this.router.navigateByUrl(`/case/${this.group}/${this.project}/${api._id}`)
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
