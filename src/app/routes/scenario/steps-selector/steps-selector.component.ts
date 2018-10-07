import { Location } from '@angular/common'
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CaseService, QueryCase } from '../../../api/service/case.service'
import { ScenarioService, ScenarioStepType } from '../../../api/service/scenario.service'
import { ActorEvent, ApiRes } from '../../../model/api.model'
import { Case, CaseResult, ContextOptions, ReportItemEvent, ScenarioStep } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'
import { calcDrawerWidth } from '../../../util/drawer'

@Component({
  selector: 'app-steps-selector',
  styles: [`
    .hover-red {
      font-weight: bold;
      font-style: oblique;
      display: none;
      transition: all 0.3s ease;
    }
    .step-title:hover {
      cursor: pointer;
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
  editCaseResult: CaseResult
  searchText: string
  addedItems: CaseExt[] = []
  stepCurrent = 0
  @Input() eventSubject: Subject<ActorEvent<ReportItemEvent>>
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
  _ctxOptions: ContextOptions = {}
  @Input()
  set ctxOptions(val: ContextOptions) {
    if (val) {
      this._ctxOptions = val
    }
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
    this.clearStatus()
    this.editCaseId = ''
    this.editCaseResult = undefined
    this.caseDrawerVisible = true
  }

  addItem(item: Case) {
    this.clearStatus()
    this.addedItems.push(item)
    this.dataChange.emit(this.data)
  }

  updateCase(item: Case) {
    this.clearStatus()
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
  }

  removeItem(item: Case, i: number) {
    this.clearStatus()
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

  viewCase(item: CaseExt) {
    this.editCaseId = item._id
    if (item.report) {
      this.editCaseResult = item.report.result
      if (item.report.result) {
        const ctx = item.report.result.context
        if (ctx) {
          const initCtx = { ...ctx }
          delete initCtx['entity']
          delete initCtx['headers']
          delete initCtx['status']
          if (this._ctxOptions) {
            this._ctxOptions.initCtx = initCtx
            this._ctxOptions = { ...this._ctxOptions }
          }
        }
      }
    } else {
      this.editCaseResult = undefined
      this._ctxOptions.initCtx = {}
      this._ctxOptions = { ...this._ctxOptions }
    }
    this.caseDrawerVisible = true
  }

  search() {
    this.searchCase.next({ group: this.group, project: this.project, text: this.searchText, ...this.toPageQuery() })
  }

  clearStatus() {
    this.addedItems.forEach(item => {
      item.status = ''
      item.report = undefined
    })
  }

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.searchCase.next({ group: this.group, project: this.project })
    })
    if (this.eventSubject) {
      this.eventSubject.subscribe(log => {
        const reportItem = log.data
        this.stepCurrent = reportItem.index
        if (0 === this.stepCurrent) {
          this.clearStatus()
        }
        const addedStep = this.addedItems[reportItem.index]
        addedStep.report = reportItem
        if ('pass' === reportItem.status) {
          addedStep.status = 'finish'
        } else if ('fail' === reportItem.status) {
          addedStep.status = 'error'
        }
      })
    }
  }
}

interface CaseExt extends Case {
  report?: ReportItemEvent
  status?: string
}
