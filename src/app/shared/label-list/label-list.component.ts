import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

import { LabelRef } from '../../model/es.model'

@Component({
  selector: 'app-label-list',
  templateUrl: './label-list.component.html',
})
export class LabelListComponent implements OnInit {

  labels: LabelRef[] = []
  isEditable = false
  values: string[] = []
  @Input()
  get data() {
    return this.values.map(item => {
      return { name: item }
    })
  }
  set data(val: LabelRef[]) {
    if (val && val.length > 0) {
      this.values = val.map(item => item.name)
    }
  }
  @Output()
  dataChange = new EventEmitter<LabelRef[]>()

  constructor() { }

  modelChange() {
    this.dataChange.emit(this.data)
  }

  remove(item: LabelRef, index: number) {
    this.values.splice(index, 1)
    this.modelChange()
  }

  ngOnInit(): void {
  }
}
