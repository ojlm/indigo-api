import { Location } from '@angular/common'
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { NzMessageService } from 'ng-zorro-antd'
import * as screenfull from 'screenfull'

import { CaseService } from '../../../api/service/case.service'
import { Assertion, CaseGenerator, CaseGeneratorListItem } from '../../../model/es.model'
import { formatJson } from '../../../util/json'
import { AssertionItem, AssertionItems } from '../assertion-list/assertion-list.component'

@Component({
  selector: 'app-case-generator',
  templateUrl: './case-generator.component.html',
  styleUrls: ['./case-generator.component.css']
})
export class CaseGeneratorComponent implements OnInit {

  generator: CaseGeneratorExt = { script: '', list: [] }
  tabIndex = 0
  tabBarStyle = {
    'background-color': 'snow',
    'margin': '0px',
    'height': '40px'
  }
  generatorListHeight = ''
  editorFullHeight = '480px'
  isFullscreen = screenfull.isFullscreen
  isFullDocument = false
  assertSimpleEditorMode = true
  @Input() assertions: Assertion[] = []
  assertionItems: AssertionItems = { logic: 'and', items: [] }
  wraped = false
  javascriptEditorOption = this.monocoService.getJavascriptOption(false)
  jsonEditorOption = this.monocoService.getJsonOption(false)
  /** for first modelChange event bug */
  originScript = ''
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
    }
  }
  get data() {
    return this.generator
  }
  @Output()
  dataChange = new EventEmitter<CaseGenerator>()

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private monocoService: MonacoService,
    private el: ElementRef<HTMLDivElement>,
  ) { }

  addItem() {
    this.generator.list.push({ map: [], assert: '', assertionItems: { logic: 'and', items: [] } })
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
    if (this.isFullscreen && screenfull.enabled) {
      this.isFullDocument = true
      this.editorFullHeight = `${screen.height}px`
      this.generatorListHeight = `${window.innerHeight - 40}px`
    } else {
      this.isFullDocument = false
      this.editorFullHeight = '480px'
      this.generatorListHeight = ''
    }
    if (screenfull.enabled) {
      screenfull.toggle()
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

  formatAssert() {
    try {
      this.generator.list.forEach(item => {
        item.assert = formatJson(item.assert, 2)
      })
      this.modelChange()
    } catch (error) { console.error(error) }
  }

  scriptChange() {
    if (this.originScript !== this.generator.script) {
      this.modelChange()
    }
  }

  modelChange() {
    this.dataChange.emit(this.data)
  }

  syncToAssertionItems(listItem: ListItem) {
    this.parseAssertionItems(listItem)
    this.modelChange()
  }

  parseAssertionItems(listItem: ListItem) {
    try {
      if (!listItem.assert) return
      let items = null
      const assert = JSON.parse(listItem.assert)
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

  ngOnInit(): void {
  }
}

interface ListItem extends CaseGeneratorListItem {
  assertionItems?: AssertionItems
}

interface CaseGeneratorExt extends CaseGenerator {
  list?: ListItem[]
}
