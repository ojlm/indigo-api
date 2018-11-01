import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { AggsItem, CaseService, QueryCase } from 'app/api/service/case.service'
import { ApiRes } from 'app/model/api.model'
import { METHODS } from 'app/model/es.model'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-case-search-panel',
  templateUrl: './case-search-panel.component.html',
})
export class CaseSearchPanelComponent implements OnInit {

  showAll = false
  search: QueryCase = {}
  @Input() size = 'default'
  @Input()
  get data() {
    return this.search
  }
  set data(val: QueryCase) {
    if (val) {
      this.search = val
    }
  }
  @Output()
  dataChange = new EventEmitter<QueryCase>()
  @Input()
  subject: Subject<QueryCase>
  methods = METHODS
  isLoading = false
  queryLabelSubject: Subject<string>
  items: AggsItem[] = []

  constructor(
    private caseService: CaseService,
  ) {
    const response = new Subject<ApiRes<AggsItem[]>>()
    this.queryLabelSubject = this.caseService.aggsLabelsSubject(response)
    response.subscribe(res => {
      this.items = res.data
    })
  }

  searchLabel(label: string) {
    this.queryLabelSubject.next(label)
  }

  modelChange() {
    this.dataChange.emit(this.data)
    if (this.subject) {
      this.subject.next(this.data)
    }
  }

  ngOnInit(): void {
  }
}
