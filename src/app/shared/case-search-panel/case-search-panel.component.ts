import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { QueryCase } from 'app/api/service/case.service'
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

  constructor() { }

  modelChange() {
    this.dataChange.emit(this.data)
    if (this.subject) {
      this.subject.next(this.data)
    }
  }

  ngOnInit(): void {
  }
}
