import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { QueryDubboRequest } from 'app/api/service/dubbo.service'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-dubbo-search-panel',
  templateUrl: './dubbo-search-panel.component.html',
})
export class DubboSearchPanelComponent implements OnInit {

  search: QueryDubboRequest = {}
  @Input() size = 'default'
  @Input()
  get data() {
    return this.search
  }
  set data(val: QueryDubboRequest) {
    if (val) {
      this.search = val
    }
  }
  @Output()
  dataChange = new EventEmitter<QueryDubboRequest>()
  @Input()
  subject: Subject<QueryDubboRequest>

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
