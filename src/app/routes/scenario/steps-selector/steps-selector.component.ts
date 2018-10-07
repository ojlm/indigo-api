import { Location } from '@angular/common'
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CaseService, QueryCase } from '../../../api/service/case.service'
import { ScenarioService, ScenarioStepType } from '../../../api/service/scenario.service'
import { ApiRes } from '../../../model/api.model'
import { Case, ScenarioStep } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'
import { calcDrawerWidth } from '../../../util/drawer'

@Component({
  selector: 'app-steps-selector',
  styles: [`
    .click-icon {
      font-weight: bold;
      font-style: oblique;
    }
    .hover-red {
      display: none;
      transition: all 0.3s ease;
    }
    .step:hover {
      cursor: pointer;
    }
    .step:hover .step-title {
    }
    .step:hover .hover-red {
      display: inline-block;
    }
    .step:hover .hover-red:hover {
      color:red;
      transform: rotate(180deg);
    }
  `],
  templateUrl: './steps-selector.component.html',
})
export class StepsSelectorComponent extends PageSingleModel implements OnInit {

  drawerWidth = calcDrawerWidth()
  pageSize = 10
  group: string
  project: string
  items: Case[] = []
  searchCase: Subject<QueryCase>
  caseDrawerVisible = false
  editCaseId: string
  searchText: string
  addedItems: Case[] = []
  stepCurrent = 0

  @Input()
  set data(steps: ScenarioStep[]) {
    if (steps.length > 0 && this.addedItems.length === 0) {
      const caseIds = steps.filter(step => ScenarioStepType.CASE === step.type).map(step => step.id)
      this.caseService.query({ ids: caseIds }).subscribe(res => {
        this.addedItems = res.data.list
      })
    } else if (steps.length === 0 && this.addedItems.length !== 0) {
      this.addedItems = []
    }
  }
  get data() {
    return this.addedItems.map(item => {
      const step: ScenarioStep = {
        type: ScenarioStepType.CASE,
        id: item._id
      }
      return step
    })
  }
  @Output() dataChange = new EventEmitter<ScenarioStep[]>()
  @HostListener('window:resize')
  resizeBy() {
    this.drawerWidth = calcDrawerWidth()
  }

  constructor(
    private caseService: CaseService,
    private scenarioService: ScenarioService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    super()
    const response = new Subject<ApiRes<Case[]>>()
    response.subscribe(res => {
      this.pageTotal = res.data.total
      this.items = res.data.list
    })
    this.searchCase = this.caseService.newQuerySubject(response)
  }

  addNewCaseStep() {
    this.editCaseId = ''
    this.caseDrawerVisible = true
  }

  addItem(item: Case) {
    this.addedItems.push(item)
    this.dataChange.emit(this.data)
  }

  updateCase(item: Case) {
    const newAddedItems = []
    this.addedItems.forEach(i => {
      if (i._id === item._id) {
        newAddedItems.push(item)
      } else {
        newAddedItems.push(i)
      }
    })
    this.addedItems = newAddedItems
    const newItems = []
    this.items.forEach(i => {
      if (i._id === item._id) {
        newItems.push(item)
      } else {
        newItems.push(i)
      }
    })
    this.items = newItems
    console.log(this.addedItems)
  }

  removeItem(item: Case, i: number) {
    this.addedItems.splice(i, 1)
    this.dataChange.emit(this.data)
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

  viewCase(item: Case) {
    this.editCaseId = item._id
    this.caseDrawerVisible = true
  }

  search() {
    this.searchCase.next({ group: this.group, project: this.project, text: this.searchText, ...this.toPageQuery() })
  }

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.searchCase.next({ group: this.group, project: this.project })
    })
  }
}
