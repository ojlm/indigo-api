import { Location } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { Assertion } from '../../../model/es.model'

@Component({
  selector: 'app-assertion-list',
  templateUrl: './assertion-list.component.html',
  styles: [`
    .assertion-list {
      overflow: auto;
    }
    .assertion-list::-webkit-scrollbar {
      width: 5px;
    }
    .assertion-list::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      border-radius: 1px;
    }
    .assertion-list::-webkit-scrollbar-thumb {
      border-radius: 1px;
      -webkit-box-shadow: inset 0 0 3px rgba(0,0,0,0.7);
    }
  `]
})
export class AssertionListComponent implements OnInit {

  editorFullHeight = '470px'
  items: AssertionItem[] = []
  @Input() assertions: Assertion[] = []
  @Input()
  get data() {
    return this.items
  }
  set data(value: AssertionItem[]) {
    if (value && value.length > 0) {
      this.items = value
    }
  }
  @Output()
  dataChange = new EventEmitter<AssertionItem[]>()

  constructor(
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  addItem() {
    this.items.push({ path: '', operator: '$eq', value: '' })
    this.modelChange()
  }

  copy(item: AssertionItem, index: number) {
    this.items.push({ ...item })
    this.modelChange()
  }

  remove(item: AssertionItem, index: number) {
    this.items.splice(index, 1)
    this.modelChange()
  }

  modelChange() {
    this.dataChange.emit(this.data)
  }

  ngOnInit(): void {
  }
}

export interface AssertionItem {
  path?: string
  operator?: string
  value?: string
}
