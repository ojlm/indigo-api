import { Location } from '@angular/common'
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { NzMessageService } from 'ng-zorro-antd'
import { DiffEditorModel } from 'ngx-monaco-editor'
import * as screenfull from 'screenfull'

import { CaseService } from '../../../api/service/case.service'
import { Assertion, CaseResult } from '../../../model/es.model'
import { formatJson } from '../../../util/json'
import { AssertionItem, AssertionItems } from '../assertion-list/assertion-list.component'

@Component({
  selector: 'app-result-assert',
  templateUrl: './result-assert.component.html',
})
export class ResultAssertComponent implements OnInit {

  containerStyle = {}
  tabBarStyle = {
    'background-color': 'snow',
    'margin': '0px',
    'height': '40px'
  }
  editorFullHeight = '480px'
  assertionEditorHeight = '470px'
  isFullscreen = false
  tabIndex = 0
  /** for first modelChange event bug */
  originAssert = ''
  _assert = ''
  caseContext = ''
  caseRequest = ''
  caseAssertResult = ''
  originalModel: DiffEditorModel = {
    code: '',
    language: 'json'
  }
  modifiedModel: DiffEditorModel = {
    code: '',
    language: 'json'
  }
  assertSimpleEditorMode = true
  assertions: Assertion[] = []
  assertionItems: AssertionItems = { logic: 'and', items: [] }
  @Input()
  set index(val: number) {
    this.tabIndex = val
  }
  @Output()
  indexChange = new EventEmitter<number>()
  @Input()
  set result(val: CaseResult) {
    this.caseContext = formatJson(val.context)
    this.modifiedModel = { code: this.caseContext || '', language: 'json' }
    this.caseRequest = formatJson(val.request)
    this.caseAssertResult = formatJson(val.result)
  }
  @Input()
  get assert() {
    return this._assert
  }
  set assert(val: string) {
    if (typeof val === 'string') {
      this._assert = val
    } else {
      this._assert = formatJson(val)
    }
    if (!this.originAssert) {
      this.syncToAssertionList()
    }
    this.originAssert = this._assert
  }
  @Output()
  assertChange = new EventEmitter<string>()
  @Input()
  set lastResult(val: any) {
    try {
      this.originalModel = { code: formatJson(val) || '', language: 'json' }
    } catch (error) { console.error(error) }
  }
  wraped = false
  jsonRoEditorOption = this.monocoService.getJsonOption(true)
  jsonEditorOption = this.monocoService.getJsonOption(false)

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

  assertionItemsChange() {
    try {
      const list = this.assertionItems.items.map(item => {
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
        if (this._assert) {
          assert = JSON.parse(this._assert)
        }
      } catch (error) {
        console.error(error, this._assert)
      }
      if ('or' === this.assertionItems.logic) {
        assert['$list_or'] = list
        delete assert['$list_and']
      } else {
        assert['$list_and'] = list
        delete assert['$list_or']
      }
      this._assert = formatJson(assert)
      this.assertChange.emit(this._assert)
    } catch (error) {
      console.error(error)
    }
  }

  fullBtnClick() {
    this.isFullscreen = !this.isFullscreen
    const container = this.el.nativeElement.firstChild
    if (this.isFullscreen && screenfull.enabled) {
      screenfull.request(container)
      this.containerStyle = {
        height: '100%',
        width: '100%',
      }
      this.editorFullHeight = `${screen.height}px`
      this.assertionEditorHeight = `${screen.height - 40}px`
    } else {
      this.containerStyle = {}
      this.editorFullHeight = '480px'
      this.assertionEditorHeight = '470px'
      screenfull.exit()
    }
  }

  wrap() {
    this.wraped = !this.wraped
    if (this.wraped) {
      this.jsonEditorOption = { ...this.jsonEditorOption, 'wordWrap': 'on' }
      this.jsonRoEditorOption = { ...this.jsonRoEditorOption, 'wordWrap': 'on' }
    } else {
      this.jsonEditorOption = { ...this.jsonEditorOption, 'wordWrap': 'off' }
      this.jsonRoEditorOption = { ...this.jsonRoEditorOption, 'wordWrap': 'off' }
    }
  }

  assertEditorModeChange() {
    this.assertSimpleEditorMode = !this.assertSimpleEditorMode
    this.tabIndex = 0
  }

  formatAssert() {
    try {
      this._assert = formatJson(this._assert)
      this.modelChange()
    } catch (error) { console.error(error) }
  }

  tabIndexChange() {
    this.indexChange.emit(this.tabIndex)
  }

  modelChange() {
    if (this.originAssert !== this._assert) {
      this.originAssert = null
      this.assertChange.emit(this._assert)
      this.syncToAssertionList()
    }
  }

  syncToAssertionList() {
    try {
      if (!this._assert) return
      let items = null
      const assert = JSON.parse(this._assert)
      let loginOp = 'and'
      if (assert['$list_or']) {
        items = assert['$list_or']
        loginOp = 'or'
      } else {
        items = assert['$list_and']
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
        this.assertionItems = {
          logic: loginOp,
          items: assertionItems
        }
      }
    } catch (error) { }
  }

  ngOnInit(): void {
    if (this.assertions && this.assertions.length === 0) {
      this.caseService.getAllAssertions().subscribe(res => {
        this.assertions = res.data
      })
    }
  }
}
