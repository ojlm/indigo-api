import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { SortablejsOptions } from 'angular-sortablejs'

import { KeyValueObject } from '../../model/es.model'

@Component({
  selector: 'app-key-value',
  templateUrl: './key-value.component.html',
})
export class KeyValueComponent implements OnInit {

  sortablejsOptions: SortablejsOptions = {
    handle: '.anticon-bars',
    onUpdate: function (event: any) {
      this.dataChange.emit(this.data)
    }.bind(this)
  }
  values: KeyValueObject[] = []
  @Input()
  get data() {
    return this.values.filter(item => Object.keys(item).length > 0)
  }
  set data(val: KeyValueObject[]) {
    if (!val) val = []
    this.values = [...val, {}]
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
    if (index === this.data.length) return
    if (this.data.length > 0) {
      this.values.splice(index, 1)
      this.values = [...this.values]
      this.dataChange.emit(this.data)
    } else {
      this.values = []
      this.dataChange.emit(this.data)
    }
  }

  ngOnInit(): void {
  }
}
