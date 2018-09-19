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
    this._assert = formatJson(val)
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
    } else {
      this.containerStyle = {}
      this.editorFullHeight = '480px'
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
    }
  }

  ngOnInit(): void {
    if (this.assertions && this.assertions.length === 0) {
      this.caseService.getAllAssertions().subscribe(res => {
        this.assertions = res.data
      })
    }
  }
}
