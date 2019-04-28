import { Location } from '@angular/common'
import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { CaseService } from 'app/api/service/case.service'
import { SqlResult, SqlService } from 'app/api/service/sql.service'
import { Assertion, SqlRequest } from 'app/model/es.model'
import { calcDrawerWidth } from 'app/util/drawer'
import { formatJson } from 'app/util/json'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-sql-playground',
  templateUrl: './sql-playground.component.html',
  styles: [`
    .col-panel {
      text-align: left;
      margin-top: 4px;
    }
    .col-panel label {
      color: darkgray;
      font-size: smaller;
    }
    .body-panel {
      height: 100%;
    }
  `]
})
export class SqlPlaygroundComponent implements OnInit {

  @Input() group = ''
  @Input() project = ''
  tabBarStyle = {
    'background-color': 'snow',
    'margin': '0px',
    'height': '40px'
  }
  assertions: Assertion[] = []
  tabIndex = 0
  assertResultTabIndex = 0
  isSending = false
  @Input() newStep: Function
  @Input() updateStep: Function
  @Input() isInDrawer = false
  isSaved = true
  drawerWidth = calcDrawerWidth(0.4)
  request: SqlRequest = {}
  height = `${window.innerHeight - 70}px`
  subHeight = `${window.innerHeight - 148}px`
  tableScroll = { y: `${window.innerHeight - 160}px` }
  sqlEditorOption = { ...this.monocoService.getSqlOption(false), theme: this.monocoService.THEME_WHITE }
  jsonRoEditorOption = { ...this.monocoService.getJsonOption(true), theme: this.monocoService.THEME_WHITE }
  jsonEditorOption = { ...this.monocoService.getJsonOption(false), theme: this.monocoService.THEME_WHITE }
  responseStr = ''
  assertionsStr = ''
  resultStr = ''
  @Input()
  set id(docId: string) {
    this.tabIndex = 1
    this.assertResultTabIndex = 0
    this.loadDataById(docId)
  }
  @Input()
  set result(result: SqlResult) {
    if (result) {
      this.tabIndex = 5
      this.assertResultTabIndex = 5
      this.dealResult(result)
    }
  }
  @HostListener('window:resize')
  resize() {
    this.height = `${window.innerHeight - 70}px`
    this.subHeight = `${window.innerHeight - 148}px`
    this.tableScroll = { y: `${window.innerHeight - 160}px` }
  }

  constructor(
    private caseService: CaseService,
    private sqlService: SqlService,
    private monocoService: MonacoService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private i18nService: I18NService,
    private el: ElementRef<HTMLDivElement>,
  ) {
    initRequestField(this.request)
  }

  modelChange() {
    this.isSaved = false
  }

  send() {
    this.isSending = true
    const newReq = this.preHandleRequest(this.request)
    if (newReq) {
      this.sqlService.test({ id: this.request._id, request: newReq }).subscribe(res => {
        this.dealResult(res.data)
        this.isSending = false
      }, err => this.isSending = false)
    }
  }

  dealResult(result: SqlResult) {
    this.responseStr = formatJson(result.context)
    this.resultStr = formatJson({ statis: result.statis, result: result.result })
  }

  save() {
    if (this.request.summary) {
      const newReq = this.preHandleRequest(this.request)
      if (newReq) {
        if (this.request._id) {
          this.sqlService.update(this.request._id, newReq).subscribe(res => {
            this.isSaved = true
            if (this.updateStep) {
              this.updateStep(this.request)
            }
            this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
          })
        } else {
          this.sqlService.index(newReq).subscribe(res => {
            this.request._id = res.data.id
            this.isSaved = true
            if (this.newStep) {
              this.newStep(this.request)
            }
            this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
          })
        }
      }
    } else {
      this.msgService.error(this.i18nService.fanyi(I18nKey.ErrorEmptySummary))
    }
  }

  saveAs() {
    if (this.request.summary) {
      const newReq = this.preHandleRequest(this.request)
      if (newReq) {
        this.sqlService.index(newReq).subscribe(res => {
          this.request._id = res.data.id
          this.isSaved = true
          if (this.newStep) {
            this.newStep(this.request)
          }
          this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
        })
      }
    } else {
      this.msgService.error(this.i18nService.fanyi(I18nKey.ErrorEmptySummary))
    }
  }

  reset() {
  }

  preHandleRequest(req: SqlRequest) {
    let port: number
    if (this.request.port) {
      port = parseInt(this.request.port.toString(), 10)
    }
    if (!port || isNaN(port)) {
      this.msgService.error('port must be a number')
      return null
    } else {
      try {
        const newReq: SqlRequest = JSON.parse(JSON.stringify(req))
        newReq._id = undefined
        newReq._creator = undefined
        newReq.creator = undefined
        newReq.createdAt = undefined
        newReq.group = this.group || req.group
        newReq.project = this.project || req.project
        newReq.port = port
        if (this.assertionsStr) {
          newReq.assert = JSON.parse(this.assertionsStr)
        } else {
          newReq.assert = {}
        }
        return newReq
      } catch (error) {
        this.msgService.error('invalid format')
        return null
      }
    }
  }

  loadDataById(docId: string) {
    if (docId) {
      this.sqlService.getById(docId).subscribe(res => {
        this.request = res.data
        this.request._id = docId
        this.assertionsStr = formatJson(this.request.assert, 2)
      })
    }
  }

  ngOnInit(): void {
    if (this.route.parent && this.route.parent.parent) {
      this.route.parent.parent.params.subscribe(params => {
        this.group = params['group']
        this.project = params['project']
      })
      this.route.parent.params.subscribe(params => {
        this.loadDataById(params['sqlId'])
      })
    }
    if (this.assertions && this.assertions.length === 0) {
      this.caseService.getAllAssertions().subscribe(res => {
        this.assertions = res.data
      })
    }
  }
}

export function initRequestField(reqeust: SqlRequest) {

}
