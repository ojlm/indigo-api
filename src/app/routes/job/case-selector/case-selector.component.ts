import { Location } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CaseService, QueryCase } from '../../../api/service/case.service'
import { ApiRes } from '../../../model/api.model'
import { Case } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

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
  `],
  templateUrl: './case-selector.component.html',
})
export class CaseSelectorComponent extends PageSingleModel implements OnInit {

  pageSize = 10
  group: string
  project: string
  items: Case[] = []
  searchCase: Subject<QueryCase>
  caseDrawerVisible = false
  editCaseId: string
  searchText: string
  addedItemsMap = {}
  addedItems: Case[] = []

  @Input()
  set data(ids: string[]) {
    if (ids.length > 0 && this.addedItems.length === 0) {
      this.caseService.query({ ids: ids }).subscribe(res => {
        this.addedItems = res.data.list
        this.addedItems.forEach(item => this.addedItemsMap[item._id] = true)
      })
    }
  }
  get data() {
    return this.addedItems.map(item => item._id)
  }
  @Output() dataChange = new EventEmitter<string[]>()

  constructor(
    private caseService: CaseService,
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
