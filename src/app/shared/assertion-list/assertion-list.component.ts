import { Location } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AutocompleteContext } from 'app/model/indigo.model'
import { NzMessageService } from 'ng-zorro-antd'

import { Assertion } from '../../model/es.model'

@Component({
  selector: 'app-assertion-list',
  templateUrl: './assertion-list.component.html',
})
export class AssertionListComponent implements OnInit {

  @Input() autocompleteContext = new AutocompleteContext()
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

// AssertionItem => {"$.a":{"$eq":""}}
export function assertItemToSingleObject(item: AssertionItem): object {
  const pathObj = {}
  const path = item.path
  const operator = item.operator
  let value = null
  if (item.value) {
    const num = Number(item.value)
    if (isNaN(num)) {
      if ('true' === item.value) {
        value = true
      } else if ('false' === item.value) {
        value = false
      } else {
        value = item.value
      }
    } else {
      value = num
    }
  }
  const assertionObj = {}
  assertionObj[operator] = value
  pathObj[path] = assertionObj
  return pathObj
}

export function assertionItemsAdaptAssertObject(assert: object, items: AssertionItems) {
  const list = items.items.map(item => assertItemToSingleObject(item))
  if ('or' === items.logic) {
    assert['$list-or'] = list
    delete assert['$list-and']
  } else {
    assert['$list-and'] = list
    delete assert['$list-or']
  }
  return assert
}

export function assertObjectToAssertionItems(assertObj: object): AssertionItems {
  try {
    let itemsArray = null
    let loginOp = 'and'
    if (assertObj['$list-or']) {
      itemsArray = assertObj['$list-or']
      loginOp = 'or'
    } else {
      itemsArray = assertObj['$list-and']
    }
    if (itemsArray) {
      const assertionItems: AssertionItem[] = []
      for (const item of itemsArray) {
        const paths = Object.keys(item)
        if (paths && paths.length === 1) {
          const path = paths[0]
          const assertionObj = item[path]
          if (assertionObj) {
            const ops = Object.keys(assertionObj)
            if (ops && ops.length === 1) {
              assertionItems.push({
                path: path,
                operator: ops[0],
                value: assertionObj[ops[0]]
              })
            }
          }
        }
      }
      return { logic: loginOp, items: assertionItems }
    } else {
      return { logic: loginOp, items: [] }
    }
  } catch (error) { return null }
}
