import { Component, HostListener, Input, OnInit } from '@angular/core'
import { GroupProjectSelectorModel } from '@shared/group-project-selector/group-project-selector.component'
import { dubboRequestSignature, DubboService, QueryDubboRequest } from 'app/api/service/dubbo.service'
import { QuerySqlRequest, sqlRequestSignature, SqlService } from 'app/api/service/sql.service'
import { ApiRes } from 'app/model/api.model'
import { PageSingleModel } from 'app/model/page.model'
import { CaseModelComponent } from 'app/routes/case/case-model/case-model.component'
import { DubboPlaygroundComponent } from 'app/routes/dubbo/dubbo-playground/dubbo-playground.component'
import { SqlPlaygroundComponent } from 'app/routes/sql/sql-playground/sql-playground.component'
import { calcDrawerWidth } from 'app/util/drawer'
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CaseService, QueryCase } from '../../../api/service/case.service'
import {
  caseToScenarioStep,
  dubboRequestToScenarioStep,
  sqlRequestToScenarioStep,
} from '../../../api/service/scenario.service'
import { Case, ContextOptions, DubboRequest, ScenarioStep, SqlRequest } from '../../../model/es.model'

@Component({
  selector: 'app-select-step',
  styles: [`
    .search-group-project {
      margin-bottom: 8px;
    }
    .line {
      width: 100%;
      cursor: pointer;
    }
    .line .title {
      padding-left: 4px;
      font-size: smaller;
      color: lightgray;
    }
    .line .title .summary {
      color: black;
      margin-right: 4px;
    }
    .line .tail-labels {
      float: right;
      transform: scale(0.8);
    }
    .line .tail-text {
      float: right;
      color: lightslategrey;
      font-size: small;
    }`
  ],
  templateUrl: './select-step.component.html',
})
export class SelectStepComponent implements OnInit {

  @Input()
  set group(val: string) {
    this.searchGroupProject.group = val
  }
  @Input()
  set project(val: string) {
    this.searchGroupProject.project = val
  }
  tabIndex = 0
  drawerWidth = calcDrawerWidth()
  searchGroupProject: GroupProjectSelectorModel

  httpItems: Case[] = []
  httpItemsPage = new PageSingleModel()
  searchHttpStepModel: QueryCase = {}
  searchHttpStepSubject: Subject<QueryCase>

  dubboItems: DubboRequest[] = []
  dubboItemsPage = new PageSingleModel()
  searchDubboStepModel: QueryDubboRequest = {}
  searchDubboStepSubject: Subject<QueryDubboRequest>

  sqlItems: SqlRequest[] = []
  sqlItemsPage = new PageSingleModel()
  searchSqlStepModel: QuerySqlRequest = {}
  searchSqlStepSubject: Subject<QuerySqlRequest>

  _ctxOptions: ContextOptions = {}
  @Input()
  set ctxOptions(val: ContextOptions) {
    if (val) {
      this._ctxOptions = val
    }
  }
  @Input() onSelectSubject: Subject<StepEvent>
  @Input() onUpdateSubject: Subject<StepEvent>
  @HostListener('window:resize')
  resize() {
    this.drawerWidth = calcDrawerWidth()
  }

  constructor(
    private caseService: CaseService,
    private dubboService: DubboService,
    private sqlService: SqlService,
    private drawerService: NzDrawerService,
    private msgService: NzMessageService,
  ) {
    this.searchGroupProject = {
      group: this.group,
      project: this.project
    }
  }

  tabIndexChange() {
    if (1 === this.tabIndex && this.dubboItems.length === 0) {
      this.searchDubboSteps()
    } else if (2 === this.tabIndex && this.sqlItems.length === 0) {
      this.searchSqlSteps()
    }
  }

  groupProjectChange() {
    switch (this.tabIndex) {
      case 0:
        this.searchHttpSteps()
        break
      case 1:
        this.searchDubboSteps()
        break
      case 2:
        this.searchSqlSteps()
        break
    }
  }

  addHttpStep(item: Case) {
    if (this.onSelectSubject) {
      this.onSelectSubject.next({
        step: caseToScenarioStep(item),
        stepData: item
      })
    }
  }

  addDubboStep(item: DubboRequest) {
    if (this.onSelectSubject) {
      this.onSelectSubject.next({
        step: dubboRequestToScenarioStep(item),
        stepData: item
      })
    }
  }

  addSqlStep(item: SqlRequest) {
    if (this.onSelectSubject) {
      this.onSelectSubject.next({
        step: sqlRequestToScenarioStep(item),
        stepData: item
      })
    }
  }

  dubboSignature(item: DubboRequest) {
    return dubboRequestSignature(item)
  }

  sqlSignature(item: SqlRequest) {
    return sqlRequestSignature(item)
  }

  viewHttpStep(item: Case) {
    this.drawerService.create({
      nzWidth: this.drawerWidth,
      nzContent: CaseModelComponent,
      nzContentParams: {
        id: item._id,
        newStep: (stepData: Case) => {
          this.onSelectSubject.next({ step: caseToScenarioStep(stepData), stepData: stepData })
        },
        updateStep: (stepData: Case) => {
          this.httpItems = this.httpItems.map(httpItem => {
            if (httpItem._id === stepData._id) {
              return stepData
            } else {
              return item
            }
          })
          this.onUpdateSubject.next({ step: caseToScenarioStep(stepData), stepData: stepData })
        },
        isInDrawer: true,
        ctxOptions: this._ctxOptions
      },
      nzBodyStyle: {
        padding: '4px'
      },
      nzClosable: false,
    })
  }

  viewDubboStep(item: DubboRequest) {
    this.drawerService.create({
      nzWidth: this.drawerWidth,
      nzContent: DubboPlaygroundComponent,
      nzContentParams: {
        id: item._id,
        newStep: (stepData: DubboRequest) => {
          this.onSelectSubject.next({ step: dubboRequestToScenarioStep(stepData), stepData: stepData })
        },
        updateStep: (stepData: DubboRequest) => {
          this.dubboItems = this.dubboItems.map(dubboItem => {
            if (dubboItem._id === stepData._id) {
              return stepData
            } else {
              return item
            }
          })
          this.onUpdateSubject.next({ step: dubboRequestToScenarioStep(stepData), stepData: stepData })
        },
        isInDrawer: true,
        ctxOptions: this._ctxOptions
      },
      nzBodyStyle: {
        padding: '4px'
      },
      nzClosable: false,
    })
  }

  viewSqlStep(item: SqlRequest) {
    this.drawerService.create({
      nzWidth: this.drawerWidth,
      nzContent: SqlPlaygroundComponent,
      nzContentParams: {
        id: item._id,
        newStep: (stepData: SqlRequest) => {
          this.onSelectSubject.next({ step: sqlRequestToScenarioStep(stepData), stepData: stepData })
        },
        updateStep: (stepData: SqlRequest) => {
          this.sqlItems = this.sqlItems.map(sqlItem => {
            if (sqlItem._id === stepData._id) {
              return stepData
            } else {
              return item
            }
          })
          this.onUpdateSubject.next({ step: sqlRequestToScenarioStep(stepData), stepData: stepData })
        },
        isInDrawer: true,
        ctxOptions: this._ctxOptions
      },
      nzBodyStyle: {
        padding: '4px'
      },
      nzClosable: false,
    })
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

  searchHttpSteps() {
    this.searchHttpStepSubject.next({
      ...this.searchHttpStepModel, ...this.httpItemsPage.toPageQuery(), ...this.searchGroupProject
    })
  }

  searchDubboSteps() {
    this.searchDubboStepSubject.next({
      ...this.searchDubboStepModel, ...this.dubboItemsPage.toPageQuery(), ...this.searchGroupProject
    })
  }

  searchSqlSteps() {
    this.searchSqlStepSubject.next({
      ...this.searchSqlStepModel, ...this.sqlItemsPage.toPageQuery(), ...this.searchGroupProject
    })
  }

  ngOnInit(): void {
    const httpStepsResponse = new Subject<ApiRes<Case[]>>()
    httpStepsResponse.subscribe(res => {
      this.httpItemsPage.pageTotal = res.data.total
      this.httpItems = res.data.list
    })
    this.searchHttpStepSubject = this.caseService.newQuerySubject(httpStepsResponse)
    this.searchHttpSteps()

    const dubboStepsResponse = new Subject<ApiRes<DubboRequest[]>>()
    dubboStepsResponse.subscribe(res => {
      this.dubboItemsPage.pageTotal = res.data.total
      this.dubboItems = res.data.list
    })
    this.searchDubboStepSubject = this.dubboService.newQuerySubject(dubboStepsResponse)

    const sqlStepsResponse = new Subject<ApiRes<SqlRequest[]>>()
    sqlStepsResponse.subscribe(res => {
      this.sqlItemsPage.pageTotal = res.data.total
      this.sqlItems = res.data.list
    })
    this.searchSqlStepSubject = this.sqlService.newQuerySubject(sqlStepsResponse)
  }
}

export type ScenarioStepData = Case | SqlRequest | DubboRequest

export interface StepEvent {
  step: ScenarioStep
  stepData: ScenarioStepData
}
