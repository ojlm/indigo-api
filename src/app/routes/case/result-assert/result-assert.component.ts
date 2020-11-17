import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { MonacoService } from '@core/config/monaco.service'
import { AssertionItem, AssertionItems } from '@shared/assertion-list/assertion-list.component'
import { AutocompleteContext } from 'app/model/indigo.model'
import { DiffEditorModel } from 'ngx-monaco-editor'
import * as screenfull from 'screenfull'

import {
  Assertion,
  CaseReportItemMetrics,
  CaseResult,
  CaseStatis,
  ContentTypes,
  ContextOptions,
  KeyValueObject,
} from '../../../model/es.model'
import { formatJson } from '../../../util/json'

@Component({
  selector: 'app-result-assert',
  templateUrl: './result-assert.component.html',
  styleUrls: ['./result-assert.component.css']
})
export class ResultAssertComponent implements OnInit {

  @Input() autocompleteContext = new AutocompleteContext()
  tabBarStyle = {
    'background-color': 'snow',
    'margin': '0px',
    'height': '40px'
  }
  editorFullHeight = '480px'
  assertionEditorHeight = '470px'
  isFullscreen = this.sf.isFullscreen
  isFullDocument = false
  tabIndex = 0
  tabShow: { [k: number]: boolean } = {}
  /** for first modelChange event bug */
  originAssert = ''
  _assert = ''
  responseTabType = 'entity'
  response = { status: 200, headers: {}, entity: '' }
  responseHeaders: KeyValueObject[] = []
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
  entityEmbed = false
  entityBlobUrl: SafeUrl
  @Input() assertions: Assertion[] = []
  assertionItems: AssertionItems = { logic: 'and', items: [] }
  @Input()
  set index(val: number) {
    this.tabIndex = val
    this.tabIndexChange()
  }
  @Output()
  indexChange = new EventEmitter<number>()
  @Input()
  set result(val: CaseResult) {
    if (val.response && val.response.statusCode && val.response.headers) {
      this.response.status = val.response.statusCode
      this.response.headers = val.response.headers
      this.responseHeaders = []
      val.response.headers.map(header => {
        for (const k of Object.keys(header)) {
          this.responseHeaders.push({ key: k, value: header[k] })
        }
      })
      // handle response
      try {
        if (val.response.contentType.startsWith('image/') || val.response.contentType.startsWith('application/pdf')) {
          const b = atob(val.response.body)
          const buffer = new ArrayBuffer(b.length)
          const array = new Uint8Array(buffer)
          for (let i = 0; i < b.length; ++i) {
            array[i] = b.charCodeAt(i)
          }
          const blob = new Blob([array], { type: val.response.contentType })
          this.entityBlobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob))
          this.entityEmbed = true
        } else if (val.response.contentType.startsWith('application/javascript')) {
          this.responseEditorOptons = this.monocoService.getJavascriptOption(true)
          this.response.entity = val.response.body
          this.entityEmbed = false
        } else if (val.response.contentType.startsWith('text/html')) {
          this.responseEditorOptons = this.monocoService.getHtmlOption(true)
          this.response.entity = val.response.body
          this.entityEmbed = false
        } else {
          // application/json
          if (typeof val.response.body === 'string') {
            const bodyJson = JSON.parse(val.response.body)
            this.response.entity = JSON.stringify(bodyJson, null, '    ')
          } else {
            this.response.entity = JSON.stringify(val.response.body, null, '    ')
          }
          this.entityEmbed = false
        }
      } catch (error) {
        this.responseEditorOptons = this.monocoService.getHtmlOption(true)
        this.response.entity = val.response.body
        this.entityEmbed = false
      }
    }
    this.caseContext = formatJson(val.context)
    this.modifiedModel = { code: this.caseContext || '', language: 'json' }
    if (val.request && val.request.body && ContentTypes.JSON === val.request.body.contentType) {
      try {
        const tmp = { ...val.request }
        if (tmp.body.data) {
          tmp.body = JSON.parse(tmp.body.data)
        }
        this.caseRequest = formatJson(tmp)
      } catch (error) {
        this.caseRequest = formatJson(val.request)
      }
    } else {
      const tmp = { ...val.request }
      if (tmp.body && tmp.body.data) {
        tmp.body = JSON.parse(tmp.body.data)
      }
      this.caseRequest = formatJson(tmp)
    }
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
  _initCtx = ''
  @Input()
  set ctxOptions(options: ContextOptions) {
    if (options && options.initCtx) {
      this._initCtx = formatJson(options.initCtx)
    }
  }
  wraped = false
  responseEditorOptons = this.monocoService.getJsonOption(true)
  jsonRoEditorOption = this.monocoService.getJsonOption(true)
  jsonEditorOption = this.monocoService.getJsonOption(false)

  constructor(
    private monocoService: MonacoService,
    private sanitizer: DomSanitizer,
  ) { }

  assertionItemsChange() {
    try {
      const list = this.assertionItems.items.map(item => {
        const pathObj = {}
        const path = item.path
        const operator = item.operator
        let value = null
        if (typeof item.value === 'string' && '' !== item.value) {
          if ('true' === item.value) {
            value = true
          } else if ('false' === item.value) {
            value = false
          } else {
            // check if it is number
            const num = Number(item.value)
            if (isNaN(num)) { // string
              if (item.value.startsWith('"') && item.value.endsWith('"')) { // check if a number string like : "123"
                const trim = item.value.substring(1, item.value.length - 1)
                if (isNaN(Number(trim))) { // not number
                  value = item.value
                } else { // number string
                  value = trim
                }
              } else {
                value = item.value
              }
            } else {  // number
              value = num
            }
          }
        } else {
          value = item.value
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
    if (this.isFullscreen && this.sf.isEnabled) {
      this.isFullDocument = true
      this.editorFullHeight = `${screen.height}px`
      this.assertionEditorHeight = `${screen.height - 40}px`
    } else {
      this.isFullDocument = false
      this.editorFullHeight = '480px'
      this.assertionEditorHeight = '470px'
    }
    if (this.sf.isEnabled) {
      this.sf.toggle()
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
    this.tabShow[this.tabIndex] = true
    this.indexChange.emit(this.tabIndex)
  }

  modelChange() {
    if (this.originAssert !== this._assert) {
      this.originAssert = null
      this.assertChange.emit(this._assert)
      this.syncToAssertionList()
    }
  }

  private get sf(): screenfull.Screenfull {
    return screenfull as screenfull.Screenfull;
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
                let assertionObjValue = assertionObj[ops[0]]
                if (typeof assertionObjValue === 'string') { // check if it is a string number
                  if (!isNaN(Number(assertionObjValue))) {
                    assertionObjValue = `"${assertionObjValue}"`
                  }
                }
                assertionItems.push({
                  path: path,
                  operator: ops[0],
                  value: assertionObjValue
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
  }
}
