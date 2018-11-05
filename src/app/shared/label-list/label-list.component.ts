import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { AggsItem, CaseService } from 'app/api/service/case.service'
import { ApiRes } from 'app/model/api.model'
import { Subject } from 'rxjs'

import { LabelRef } from '../../model/es.model'

@Component({
  selector: 'app-label-list',
  templateUrl: './label-list.component.html',
})
export class LabelListComponent implements OnInit {

  labels: AggsItem[] = []
  isEditable = false
  values: string[] = []
  queryLabelSubject: Subject<string>
  @Input()
  get data() {
    return this.values.map(item => {
      return { name: item }
    })
  }
  set data(val: LabelRef[]) {
    if (val) {
      this.values = val.map(item => item.name)
    }
  }
  @Output()
  dataChange = new EventEmitter<LabelRef[]>()

  constructor(
    private caseService: CaseService,
  ) {
    const response = new Subject<ApiRes<AggsItem[]>>()
    this.queryLabelSubject = this.caseService.aggsLabelsSubject(response)
    response.subscribe(res => {
      this.labels = res.data
    })
   }

  modelChange() {
    this.dataChange.emit(this.data)
  }

  searchLabel(label: string) {
    this.queryLabelSubject.next(label)
  }

  remove(item: LabelRef, index: number) {
    this.values.splice(index, 1)
    this.modelChange()
  }

  ngOnInit(): void {
  }
}
