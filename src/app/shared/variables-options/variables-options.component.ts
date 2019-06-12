import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { VariablesImportItem } from 'app/model/es.model'

@Component({
  selector: 'app-variables-options',
  templateUrl: './variables-options.component.html',
  styles: []
})
export class VariablesOptionsComponent implements OnInit {

  _data: VariablesImportItem = { extra: { options: [] } }
  @Input()
  set data(val: VariablesImportItem) {
    if (!(val.extra && val.extra.options)) {
      val.extra = { options: [] }
    }
    this._data = val
  }
  @Output()
  dataChange = new EventEmitter<VariablesImportItem>()

  constructor() { }

  closeTab(i: number) {
    this._data.extra.options.splice(i, 1)
  }

  newTab() {
    this._data.extra.options.push({ key: 'key', enabled: true })
    this.modelChange()
  }

  modelChange() {
    this.dataChange.emit(this._data)
  }

  ngOnInit(): void {
  }
}
