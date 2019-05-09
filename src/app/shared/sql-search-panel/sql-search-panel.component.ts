import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { QuerySqlRequest } from 'app/api/service/sql.service'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-sql-search-panel',
  templateUrl: './sql-search-panel.component.html',
})
export class SqlSearchPanelComponent implements OnInit {

  search: QuerySqlRequest = {}
  @Input() size = 'default'
  @Input()
  get data() {
    return this.search
  }
  set data(val: QuerySqlRequest) {
    if (val) {
      this.search = val
    }
  }
  @Output()
  dataChange = new EventEmitter<QuerySqlRequest>()
  @Input()
  subject: Subject<QuerySqlRequest>

  constructor(
  ) {
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
