import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { KeyValueObject } from '../../model/es.model'

@Component({
  selector: 'app-key-value',
  templateUrl: './key-value.component.html',
})
export class KeyValueComponent implements OnInit {

  values: KeyValueObject[] = []
  @Input()
  get data() {
    return this.values
  }
  set data(val: KeyValueObject[]) {
    if (!val) val = []
    if (val.length === 0) {
      val.push({})
    }
    this.values = val
  }
  @Output()
  dataChange = new EventEmitter<KeyValueObject[]>()
  @Input() hasCheckbox = true

  constructor(
    private route: ActivatedRoute,
  ) { }

  modelChange(item: KeyValueObject, index: number) {
    if (item.enabled === undefined) {
      item.enabled = true
    }
    if (index === this.values.length - 1) {
      this.values.push({})
      this.values = [...this.values]
    }
    this.dataChange.emit(this.data)
  }

  remove(index: number) {
    if (this.data.length > 1) {
      this.values.splice(index, 1)
      this.values = [...this.values]
      this.dataChange.emit(this.data)
    } else {
      this.values = []
      this.dataChange.emit(this.data)
    }
  }

  inputFocus(item: KeyValueObject, index: number) {
    if (index === this.values.length - 1) {
      this.values.push({})
      this.values = [...this.values]
    }
  }

  ngOnInit(): void {
  }
}
