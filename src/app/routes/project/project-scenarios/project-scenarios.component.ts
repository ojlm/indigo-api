import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { DeleteItemComponent } from '@shared/delete-item/delete-item.component'
import { calcDrawerWidth } from 'app/util/drawer'
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd'

import { QueryScenario, ScenarioService } from '../../../api/service/scenario.service'
import { Scenario } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-project-scenarios',
  templateUrl: './project-scenarios.component.html',
})
export class ProjectScenariosComponent extends PageSingleModel implements OnInit {

  search: QueryScenario = {}
  items: Scenario[] = []
  loading = false
  group: string
  project: string

  constructor(
    private scenarioService: ScenarioService,
    private msgService: NzMessageService,
    private drawerService: NzDrawerService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { super() }

  loadData() {
    if (this.group && this.project) {
      this.loading = true
      this.scenarioService.query({ group: this.group, project: this.project, ...this.search, ...this.toPageQuery() }).subscribe(res => {
        this.items = res.data.list
        this.pageTotal = res.data.total
        this.loading = false
      }, err => this.loading = false)
    }
  }

  getRouter(item: Scenario) {
    return `/scenario/${this.group}/${this.project}/${item._id}`
  }

  editItem(item: Scenario) {
    this.router.navigateByUrl(this.getRouter(item))
  }

  copyItem(item: Scenario) {
    this.scenarioService.copyById(this.group, this.project, item._id).subscribe(res => {
      this.loadData()
    })
  }

  deleteItem(item: Scenario) {
    const drawerRef = this.drawerService.create({
      nzTitle: item.summary,
      nzContent: DeleteItemComponent,
      nzContentParams: {
        group: this.group,
        project: this.project,
        data: {
          type: 'scenario',
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
