import { Location } from '@angular/common'
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { NzMessageService } from 'ng-zorro-antd'
import { DiffEditorModel } from 'ngx-monaco-editor'
import * as screenfull from 'screenfull'

import { CaseService } from '../../../api/service/case.service'
import { Assertion, CaseReportItemMetrics, CaseResult, CaseStatis } from '../../../model/es.model'
import { formatJson } from '../../../util/json'
import { AssertionItem, AssertionItems } from '../assertion-list/assertion-list.component'

@Component({
  selector: 'app-result-assert',
  templateUrl: './result-assert.component.html',
  styleUrls: ['./result-assert.component.css']
})
export class ResultAssertComponent implements OnInit {

  tabBarStyle = {
    'background-color': 'snow',
    'margin': '0px',
    'height': '40px'
  }
  editorFullHeight = '480px'
  assertionEditorHeight = '470px'
  isFullscreen = screenfull.isFullscreen
  isFullDocument = false
  tabIndex = 0
  /** for first modelChange event bug */
  originAssert = ''
  _assert = ''
  caseContext = ''
  caseRequest = ''
  caseAssertResult = ''
  metrics: CaseReportItemMetrics = {}
  statis: CaseStatis = {}
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
  hasResult = false
  @Input()
  set index(val: number) {
    this.tabIndex = val
  }
  @Output()
  indexChange = new EventEmitter<number>()
  @Input()
  set result(val: CaseResult) {
    if (val && val.statis) {
      this.hasResult = true
    } else {
      this.hasResult = false
    }
    this.caseContext = formatJson(val.context)
    this.modifiedModel = { code: this.caseContext || '', language: 'json' }
    this.caseRequest = formatJson(val.request)
    this.caseAssertResult = formatJson(val.result)
    this.metrics = val.metrics || {}
    this.statis = val.statis || {}
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
        assert['$list-or'] = list
        delete assert['$list-and']
      } else {
        assert['$list-and'] = list
        delete assert['$list-or']
      }
      this._assert = formatJson(assert)
      this.assertChange.emit(this._assert)
    } catch (error) {
      console.error(error)
    }
  }

  fullWindowBtnClick() {
    if (!this.isFullscreen) {
      this.isFullDocument = !this.isFullDocument
      if (this.isFullDocument) {
        this.editorFullHeight = `${window.innerHeight}px`
        this.assertionEditorHeight = `${window.innerHeight - 40}px`
      } else {
        this.editorFullHeight = '480px'
        this.assertionEditorHeight = '470px'
      }
    }
  }

  fullScreenBtnClick() {
    this.isFullscreen = !this.isFullscreen
    if (this.isFullscreen && screenfull.enabled) {
      this.isFullDocument = true
      this.editorFullHeight = `${screen.height}px`
      this.assertionEditorHeight = `${screen.height - 40}px`
    } else {
      this.isFullDocument = false
      this.editorFullHeight = '480px'
      this.assertionEditorHeight = '470px'
    }
    if (screenfull.enabled) {
      screenfull.toggle()
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
