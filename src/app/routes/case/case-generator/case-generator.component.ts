import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MonacoService } from '@core/config/monaco.service'
import { AssertionItem, AssertionItems } from '@shared/assertion-list/assertion-list.component'
import { ActorEvent, ActorEventType } from 'app/model/api.model'
import { Subject } from 'rxjs'
import * as screenfull from 'screenfull'

import { Assertion, CaseGenerator, CaseGeneratorListItem, CaseResult } from '../../../model/es.model'
import { formatJson } from '../../../util/json'

@Component({
  selector: 'app-case-generator',
  templateUrl: './case-generator.component.html',
  styleUrls: ['./case-generator.component.css']
})
export class CaseGeneratorComponent implements OnInit {

  generator: CaseGeneratorExt = { script: '', list: [], variables: [] }
  tabIndex = 0
  tabBarStyle = {
    'background-color': 'snow',
    'margin': '0px',
    'height': '40px'
  }
  generatorListHeight = ''
  editorFullHeight = '480px'
  isFullscreen = this.sf.isFullscreen
  isFullDocument = false
  assertSimpleEditorMode = true
  @Input() assertions: Assertion[] = []
  assertionItems: AssertionItems = { logic: 'and', items: [] }
  wraped = false
  javascriptEditorOption = this.monocoService.getJavascriptOption(false)
  jsonEditorOption = this.monocoService.getJsonOption(false)
  /** for first modelChange event bug */
  originScript = ''
  variables = ''
  originVariables = ''
  results: (CaseResult | { errMsg: string })[] = []
  @Input()
  set log(log: Subject<string>) {
    log.subscribe(msg => {
      try {
        const event = JSON.parse(msg) as ActorEvent<{ idx: number, result: CaseResult, errMsg: string }>
        if (ActorEventType.ITEM === event.type) {
          if (event.data.result) {
            this.results.push(event.data.result)
          } else {
            this.results.push({ errMsg: event.data.errMsg })
          }
        }
      } catch (error) { }
    })
  }
  @Input() sendCall: Function
  @Input() logResult: Function
  @Input()
  set data(val: CaseGenerator) {
    if (val) {
      if (!this.originScript && !val.script) {
        this.originScript = val.script
      }
      this.generator = val
      if (this.generator.list && this.generator.list.length > 0) {
        this.generator.list.forEach(item => {
          this.parseAssertionItems(item)
        })
      } else {
        this.generator.list = []
      }
      if (this.generator.variables) {
        this.variables = formatJson(this.generator.variables)
      }
    }
  }
  get data() {
    return this.generator
  }
  @Output()
  dataChange = new EventEmitter<CaseGenerator>()

  constructor(
    private monocoService: MonacoService,
  ) { }

  send() {
    if (this.sendCall) {
      this.results = []
      this.sendCall()
    }
  }

  showResult(item: CaseResult) {
    if (this.logResult) this.logResult(item)
  }

  addItem() {
    this.generator.list.push({ map: [], originAssert: '', assert: '', assertionItems: { logic: 'and', items: [] } })
  }

  run(item: ListItem, i: number) {
    console.log(i, item, this.data)
  }

  remove(item: ListItem, i: number) {
    this.generator.list.splice(i, 1)
    this.modelChange()
  }

  assertionItemsChange(listItem: ListItem) {
    try {
      const list = listItem.assertionItems.items.map(item => {
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
      })
      let assert = {}
      try {
        if (listItem.assert) {
          assert = JSON.parse(listItem.assert)
        }
      } catch (error) {
        console.error(error, listItem.assert)
      }
      if ('or' === this.assertionItems.logic) {
        assert['$list-or'] = list
        delete assert['$list-and']
      } else {
        assert['$list-and'] = list
        delete assert['$list-or']
      }
      listItem.assert = formatJson(assert, 2)
      this.modelChange()
    } catch (error) {
      console.error(error)
    }
  }

  fullWindowBtnClick() {
    if (!this.isFullscreen) {
      this.isFullDocument = !this.isFullDocument
      if (this.isFullDocument) {
        this.editorFullHeight = `${window.innerHeight}px`
        this.generatorListHeight = `${window.innerHeight - 40}px`
      } else {
        this.editorFullHeight = '480px'
        this.generatorListHeight = ''
      }
    }
  }

  fullScreenBtnClick() {
    this.isFullscreen = !this.isFullscreen
    if (this.isFullscreen && this.sf.isEnabled) {
      this.isFullDocument = true
      this.editorFullHeight = `${screen.height}px`
      this.generatorListHeight = `${window.innerHeight - 40}px`
    } else {
      this.isFullDocument = false
      this.editorFullHeight = '480px'
      this.generatorListHeight = ''
    }
    if (this.sf.isEnabled) {
      this.sf.toggle()
    }
  }

  wrap() {
    this.wraped = !this.wraped
    if (this.wraped) {
      this.jsonEditorOption = { ...this.jsonEditorOption, 'wordWrap': 'on' }
      this.javascriptEditorOption = { ...this.javascriptEditorOption, 'wordWrap': 'on' }
    } else {
      this.jsonEditorOption = { ...this.jsonEditorOption, 'wordWrap': 'off' }
      this.javascriptEditorOption = { ...this.javascriptEditorOption, 'wordWrap': 'off' }
    }
  }

  assertEditorModeChange() {
    this.assertSimpleEditorMode = !this.assertSimpleEditorMode
    this.tabIndex = 0
  }

  formatJson() {
    try {
      this.generator.list.forEach(item => {
        item.assert = formatJson(item.assert, 2)
      })
      this.modelChange()
      this.variables = formatJson(this.variables)
    } catch (error) { console.error(error) }
  }

  scriptChange() {
    if (this.originScript !== this.generator.script) {
      this.modelChange()
    }
  }

  variablesChange() {
    if (this.originVariables !== this.variables) {
      try {
        this.generator.variables = JSON.parse(this.variables)
        this.modelChange()
      } catch (error) { }
    }
  }

  modelChange() {
    this.dataChange.emit(this.data)
  }

  syncToAssertionItems(listItem: ListItem) {
    if (listItem.originAssert !== listItem.assert) {
      this.parseAssertionItems(listItem)
      this.modelChange()
    }
  }

  parseAssertionItems(listItem: ListItem) {
    try {
      if (!listItem.assert) return
      let items = null
      let assert = listItem.assert
      if (typeof listItem.assert === 'string') {
        assert = JSON.parse(listItem.assert)
      } else { // first initialize
        listItem.assert = formatJson(listItem.assert, 2)
        listItem.originAssert = listItem.assert
      }
      let loginOp = 'and'
      if (assert['$list-or']) {
        items = assert['$list-or']
        loginOp = 'or'
      } else {
        items = assert['$list-and']
      }
      if (items) {
        const assertionItems: AssertionItem[] = []
        for (const item of items) {
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
        listItem.assertionItems = {
          logic: loginOp,
          items: assertionItems
        }
      } else {
        listItem.assertionItems = {
          logic: loginOp,
          items: []
        }
      }
    } catch (error) { }
  }

  private get sf(): screenfull.Screenfull {
    return screenfull as screenfull.Screenfull;
  }

  ngOnInit(): void {
  }
}

interface ListItem extends CaseGeneratorListItem {
  assertionItems?: AssertionItems
  originAssert?: string
}

interface CaseGeneratorExt extends CaseGenerator {
  list?: ListItem[]
}
