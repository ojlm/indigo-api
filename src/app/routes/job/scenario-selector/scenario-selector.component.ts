import { Location } from '@angular/common'
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { QueryScenario, ScenarioService } from '../../../api/service/scenario.service'
import { ApiRes } from '../../../model/api.model'
import { ContextOptions, Scenario } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'
import { calcDrawerWidth } from '../../../util/drawer'

@Component({
  selector: 'app-scenario-selector',
  styles: [`
    .click-icon {
      font-weight: bold;
      font-style: oblique;
    }
    .hover-red {
      transition: all 0.3s ease;
    }
    .hover-red:hover {
      color:red;
      transform: rotate(180deg);
    }
  `],
  templateUrl: './scenario-selector.component.html',
})
export class ScenarioSelectorComponent extends PageSingleModel implements OnInit {

  drawerWidth = calcDrawerWidth(0.75)
  pageSize = 10
  group: string
  project: string
  items: Scenario[] = []
  searchSubject: Subject<QueryScenario>
  scenarioDrawerVisible = false
  editScenarioId: string
  searchText: string
  addedItemsMap = {}
  addedItems: Scenario[] = []

  @Input()
  set data(ids: string[]) {
    if (ids.length > 0 && this.addedItems.length === 0) {
      this.scenarioService.query({ ids: ids }).subscribe(res => {
        this.addedItems = res.data.list
        this.addedItems.forEach(item => this.addedItemsMap[item._id] = true)
      })
    } else if (ids.length === 0 && this.addedItems.length !== 0) {
      this.addedItems = []
      this.addedItemsMap = {}
    }
  }
  get data() {
    return this.addedItems.map(item => item._id)
  }
  @Output() dataChange = new EventEmitter<string[]>()
  _ctxOptions: ContextOptions = {}
  @Input()
  set ctxOptions(val: ContextOptions) {
    if (val) {
      this._ctxOptions = val
    }
  }
  @HostListener('window:resize')
  resize() {
    this.drawerWidth = calcDrawerWidth()
  }

  constructor(
    private scenarioService: ScenarioService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    super()
    const response = new Subject<ApiRes<Scenario[]>>()
    response.subscribe(res => {
      this.pageTotal = res.data.total
      this.items = res.data.list
    })
    this.searchSubject = this.scenarioService.newQuerySubject(response)
  }

  addItem(item: Scenario) {
    this.addedItems.push(item)
    this.addedItems = [...this.addedItems]
    this.addedItemsMap[item._id] = true
    this.dataChange.emit(this.data)
  }

  removeItem(item: Scenario, i: number) {
    this.addedItems.splice(i, 1)
    delete this.addedItemsMap[item._id]
    this.dataChange.emit(this.data)
  }

  viewScenario(item: Scenario) {
    this.editScenarioId = item._id
    this.scenarioDrawerVisible = true
  }

  search() {
    this.searchSubject.next({ group: this.group, project: this.project, text: this.searchText, ...this.toPageQuery() })
  }

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.searchSubject.next({ group: this.group, project: this.project })
    })
  }
}
