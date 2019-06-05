import { Location } from '@angular/common'
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { JobDataExt } from 'app/model/job.model'
import { CaseModelComponent } from 'app/routes/case/case-model/case-model.component'
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CaseService, QueryCase } from '../../../api/service/case.service'
import { ApiRes } from '../../../model/api.model'
import { Case, ContextOptions } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'
import { calcDrawerWidth } from '../../../util/drawer'

@Component({
  selector: 'app-case-selector',
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
    .s-line {
      padding: 4px;
      border-bottom: 1px solid lightblue;
    }
    .s-line .label {
      padding: 4px;
      font-weight: bold;
    }
    .title-tail {
      margin-right: 4px;
    }
    .title-tail .tail-labels {
      float: right;
      transform: scale(0.8);
    }
    .title-tail .tail-text {
      float: right;
      color: lightslategrey;
      font-size: small;
    }
  `],
  templateUrl: './case-selector.component.html',
})
export class CaseSelectorComponent extends PageSingleModel implements OnInit {

  caseListDrawerVisible = false
  caseListDrawerWidth = calcDrawerWidth(0.7)
  subDrawerWidth = calcDrawerWidth(0.6)
  pageSize = 20
  group: string
  project: string
  items: Case[] = []
  searchCase: Subject<QueryCase>
  searchCaseModel: QueryCase = {}
  addedItemsMap = {}
  addedItems: Case[] = []
  _ext: JobDataExt = undefined
  searchPanelShowAll = false

  @Input()
  set data(ids: string[]) {
    if (ids.length > 0 && this.addedItems.length === 0) {
      this.caseService.query({ ids: ids }).subscribe(res => {
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
  @Input()
  set ext(value: JobDataExt) {
    this._ext = value
  }
  get ext() {
    return this._ext
  }
  @Output() extChange = new EventEmitter<JobDataExt>()
  _ctxOptions: ContextOptions = {}
  @Input()
  set ctxOptions(val: ContextOptions) {
    if (val) {
      this._ctxOptions = val
    }
  }
  @HostListener('window:resize')
  resize() {
    this.caseListDrawerWidth = calcDrawerWidth(0.7)
    this.subDrawerWidth = calcDrawerWidth(0.6)
  }

  constructor(
    private caseService: CaseService,
    private drawerService: NzDrawerService,
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

  applyFilter() {
    this._ext = {
      path: this.searchCaseModel.path,
      methods: this.searchCaseModel.methods,
      text: this.searchCaseModel.text,
      labels: this.searchCaseModel.labels,
    }
    this.extChange.emit(this._ext)
  }

  cancelFilter() {
    this._ext = undefined
    this.extChange.emit(this._ext)
  }

  previewFilter() {
    if (this._ext) {
      this.searchPanelShowAll = true
      this.caseListDrawerVisible = true
      this.searchCaseModel = { ...this._ext }
      this.search()
    }
  }

  showCaseListDrawer() {
    if (this.items.length === 0) {
      this.search()
    }
    this.caseListDrawerVisible = true
  }

  clearSearchModel() {
    this.searchCaseModel = {}
    this.search()
  }

  addItem(item: Case) {
    this.addedItems.push(item)
    this.addedItems = [...this.addedItems]
    this.addedItemsMap[item._id] = true
    this.dataChange.emit(this.data)
  }

  removeItem(item: Case, i: number) {
    this.addedItems.splice(i, 1)
    delete this.addedItemsMap[item._id]
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

  viewCase(item: Case, isInDrawer = false) {
    this.drawerService.create({
      nzWidth: isInDrawer ? this.subDrawerWidth : this.caseListDrawerWidth,
      nzContent: CaseModelComponent,
      nzContentParams: {
        group: this.group,
        project: this.project,
        id: item._id,
        ctxOptions: this._ctxOptions,
        isInDrawer: true,
      },
      nzBodyStyle: {
        padding: '4px'
      },
      nzClosable: false,
    })
  }

  search() {
    this.searchCase.next({ group: this.group, project: this.project, ...this.searchCaseModel, ...this.toPageQuery() })
  }

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
    })
  }
}
