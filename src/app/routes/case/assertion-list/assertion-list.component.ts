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

  @Input() editorHeight = ''
  items: AssertionItems = { logic: 'and', items: [] }
  @Input() assertions: Assertion[] = []
  @Input()
  get data() {
    return this.items
  }
  set data(value: AssertionItems) {
    if (value && value.items && value.items.length > 0) {
      this.items = value
    }
  }
  @Output()
  dataChange = new EventEmitter<AssertionItems>()

  constructor(
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  addItem() {
    this.items.items.push({ path: '', operator: '$eq', value: '' })
    this.modelChange()
  }

  copy(item: AssertionItem, index: number) {
    this.items.items.push({ ...item })
    this.modelChange()
  }

  remove(item: AssertionItem, index: number) {
    this.items.items.splice(index, 1)
    this.modelChange()
  }

  btnLogicChange() {
    if ('and' === this.items.logic) {
      this.items.logic = 'or'
    } else {
      this.items.logic = 'and'
    }
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
  value?: any
}

export interface AssertionItems {
  logic?: string
  items?: AssertionItem[]
}
