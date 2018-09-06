import { Location } from '@angular/common'
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { NzMessageService } from 'ng-zorro-antd'
import * as screenfull from 'screenfull'

import { GroupService } from '../../../api/service/group.service'
import { ProjectService } from '../../../api/service/project.service'
import { CaseResult } from '../../../model/es.model'
import { formatJson } from '../../../util/json'

@Component({
  selector: 'app-result-assert',
  templateUrl: './result-assert.component.html',
})
export class ResultAssertComponent implements OnInit {

  containerStyle = {}
  editorFullHeight = '480px'
  isFullscreen = false
  tabIndex = 0
  _assert = ''
  caseContext = ''
  caseRequest = ''
  caseAssertResult = ''
  @Input()
  set index(val: number) {
    console.log(val)
    this.tabIndex = val
  }
  @Output()
  indexChange = new EventEmitter<number>()
  @Input()
  set result(val: CaseResult) {
    this.caseContext = formatJson(val.context)
    this.caseRequest = formatJson(val.request)
    this.caseAssertResult = formatJson(val.result)
  }
  @Input()
  get assert() {
    return this._assert
  }
  set assert(val: string) {
    if (val) {
      if (typeof val === 'string') {
        this._assert = val
      } else if (typeof val === 'object') {
        this._assert = formatJson(val)
      }
    }
  }
  @Output()
  assertChange = new EventEmitter<string>()
  jsonRoEditorOption = this.monocoService.getJsonOption(true)
  jsonEditorOption = this.monocoService.getJsonOption(false)

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private projectService: ProjectService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private monocoService: MonacoService,
    private el: ElementRef<HTMLDivElement>,
  ) { }

  btnClick() {
    this.isFullscreen = !this.isFullscreen
    const container = this.el.nativeElement.firstChild
    if (this.isFullscreen && screenfull.enabled) {
      console.log(container, screenfull)
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
  tabIndexChange() {
    this.indexChange.emit(this.tabIndex)
  }
  modelChange() {
    this.assertChange.emit(this._assert)
  }
  ngOnInit(): void {
  }
}
