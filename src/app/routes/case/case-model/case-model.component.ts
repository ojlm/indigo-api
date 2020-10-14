import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { OpenApiService } from '@core/config/openapi.service'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { ConfigService } from 'app/api/service/config.service'
import { AutocompleteContext } from 'app/model/indigo.model'
import { calcDrawerWidth } from 'app/util/drawer'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CaseService } from '../../../api/service/case.service'
import {
  Assertion,
  Case,
  CaseResult,
  ContextOptions,
  KeyValueObject,
  METHODS,
  TransformFunction,
} from '../../../model/es.model'
import { HttpContentTypes } from '../../../model/http.model'
import { hashToObj, searchToObj } from '../../../util/urlutils'

@Component({
  selector: 'app-case-model',
  styles: ['.affixed {transform:scale(1.03);;background-color:white;box-shadow:0px 0px 10px wheat;}'],
  templateUrl: './case-model.component.html',
})
export class CaseModelComponent implements OnInit, OnDestroy {

  autocompleteContext = new AutocompleteContext()
  drawerWidth = calcDrawerWidth(0.3)
  generatorLog = new Subject<string>()
  testWs: WebSocket
  logResult = this.updateResult.bind(this)
  isInNew = false
  caseRoute = ''
  isAffixed = false
  case: Case = {}
  methods = METHODS
  tabIndex = 1
  isSending = false
  assertResultTabIndex = 0
  testResult: CaseResult = {}
  lastResult = {}
  isSaved = true
  historyVisible = false
  assertions: Assertion[] = []
  transforms: TransformFunction[] = []
  _ctxOptions: ContextOptions = {}
  tabShow: { [k: number]: boolean } = {}
  // for step selector usage
  @Input() newStep: Function
  @Input() updateStep: Function
  @Input() isInDrawer = false
  @Input() group = ''
  @Input() project = ''

  @Input()
  set id(caseId: string) {
    this.testResult = {}
    this.lastResult = {}
    this.tabIndex = 1
    this.tabIndexChange()
    this.assertResultTabIndex = 0
    if (caseId) {
      this.caseService.getById(caseId).subscribe(res => {
        this.case = res.data
        this.case._id = caseId
        this.updateCaseRoute()
      })
    }
  }
  @Input()
  set result(result: CaseResult) {
    if (result) {
      this.updateResult(result)
    }
  }
  @Input()
  set ctxOptions(val: ContextOptions) {
    if (val) {
      this._ctxOptions = val
    }
  }
  @HostListener('window:resize')
  resizeBy() {
    this.drawerWidth = calcDrawerWidth(0.3)
  }

  generatorCall = () => { this.sendWs() }

  constructor(
    private configService: ConfigService,
    private msgService: NzMessageService,
    private route: ActivatedRoute,
    private i18nService: I18NService,
    private caseService: CaseService,
    private openApiService: OpenApiService,
    private modalService: NzModalService,
  ) {
    initCaseField(this.case)
  }

  tabIndexChange() {
    this.tabShow[this.tabIndex] = true
  }

  updateResult(result: CaseResult) {
    this.testResult = result
    this.lastResult = {}
    this.tabIndex = 5
    this.tabIndexChange()
    this.assertResultTabIndex = 5
    this.autocompleteContext.refeshFromHttpResult(result)
  }

  methodChange() {
    if ('GET' !== this.case.request.method) {
      if (!this.case.request.contentType) {
        this.case.request.contentType = HttpContentTypes.X_WWW_FORM_URLENCODED
      }
    }
    this.modelChange()
  }

  modelChange() {
    this.isSaved = false
  }

  onAffixChange(status: boolean) {
    this.isAffixed = status
  }

  urlChange() {
    this.modelChange()
    let urlStr = this.case.request.rawUrl
    try {
      if (urlStr) {
        urlStr = decodeURIComponent(urlStr)
        if (!(urlStr.startsWith('http://') || urlStr.startsWith('https://'))) {
          urlStr = `http://${urlStr}`
        }
        const url = new URL(urlStr)
        this.case.request.protocol = url.protocol.replace(':', '')
        this.case.request.host = url.hostname
        if (url.port) {
          this.case.request.port = parseInt(url.port, 10)
        } else {
          if (urlStr.startsWith('https://')) {
            this.case.request.port = 443
          } else {
            this.case.request.port = 80
          }
        }
        this.case.request.urlPath = decodeURI(url.pathname)
        const searchObj = searchToObj(url.search.substr(1))
        const queryKvs: KeyValueObject[] = []
        for (const k in searchObj) {
          queryKvs.push({ key: k, value: searchObj[k], enabled: true })
        }
        this.case.request.query = queryKvs
      } else {
        this.case.request.protocol = undefined
        this.case.request.host = undefined
        this.case.request.port = undefined
        this.case.request.urlPath = undefined
        this.case.request.query = []
      }
    } catch (error) {
      // this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorInvalidUrl))
    }
  }

  paramsChange() {
    this.modelChange()
    let search = '?'
    this.case.request.query.forEach(item => {
      if (item.enabled) {
        search += `${item.key || ''}=${item.value || ''}&`
      }
    })
    search = search.substr(0, search.length - 1)
    try {
      const rawUrl = this.case.request.rawUrl
      if (rawUrl && !rawUrl.startsWith('?')) {
        let hasProtocol = true
        let url: URL
        if (!(rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))) {
          hasProtocol = false
          url = new URL(`http://${rawUrl}`)
        } else {
          url = new URL(rawUrl)
        }
        url.search = search
        if (hasProtocol) {
          this.case.request.rawUrl = decodeURI(url.toString())
        } else {
          this.case.request.rawUrl = decodeURI(url.toString()).replace('http://', '').replace('https://', '')
        }
      } else {
        this.case.request.rawUrl = search
      }
    } catch (error) {
      console.error(error)
    }
  }

  sendWs() {
    const cs = this.preHandleRequest(this.case)
    if (cs) {
      if (this.testWs) {
        this.testWs.close()
        this.testWs = null
      }
      this.testWs = this.caseService.newTestWs(this.group, this.project, this.case._id)
      this.testWs.onopen = (event) => {
        const options = { ...this._ctxOptions }
        options.initCtx = undefined
        this.testWs.send(JSON.stringify({ id: this.case._id, cs: cs, options: options }))
      }
      this.testWs.onmessage = (event) => {
        if (event.data && this.generatorLog) {
          this.generatorLog.next(event.data)
        }
      }
    }
  }

  send() {
    const cs = this.preHandleRequest(this.case)
    if (cs) {
      this.isSending = true
      if (this.testResult) {
        this.lastResult = this.testResult.context
      }
      this.testResult = {}
      this.caseService.test({ id: this.case._id, cs: cs, options: this._ctxOptions }).subscribe(res => {
        this.isSending = false
        this.testResult = res.data
        this.tabIndex = 5
        if (this.case.assert && Object.keys(this.case.assert).length > 0) {
          this.assertResultTabIndex = 5
        } else {
          this.assertResultTabIndex = 0
        }
        this.tabIndexChange()
        this.autocompleteContext.refeshFromHttpResult(this.testResult)
      }, err => this.isSending = false)
    }
  }

  save() {
    if (this.case.summary) {
      const isImported = this.openApiService.isLabeldByOpenapi(this.case)
      const func = () => {
        const cs = this.preHandleRequest(this.case)
        if (cs) {
          if (this.case._id) {
            this.caseService.update(this.case._id, cs).subscribe(res => {
              this.isSaved = true
              if (this.updateStep) {
                this.updateStep(this.case)
              }
              this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
            })
          } else {
            this.caseService.index(cs).subscribe(res => {
              this.case._id = res.data.id
              this.updateCaseRoute()
              this.isSaved = true
              if (this.newStep) {
                this.newStep(this.case)
              }
              this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
            })
          }
        }
      }
      if (isImported) {
        this.modalService.confirm({
          nzTitle: this.i18nService.fanyi('tips-openapi-save'),
          nzOnOk: () => func()
        })
      } else {
        func()
      }
    } else {
      this.msgService.error(this.i18nService.fanyi(I18nKey.ErrorEmptySummary))
    }
  }

  saveAs() {
    if (this.case.summary) {
      const cs = this.preHandleRequest(this.case)
      if (cs) {
        this.caseService.index(cs).subscribe(res => {
          this.case._id = res.data.id
          this.updateCaseRoute()
          this.isSaved = true
          this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
          if (this.newStep) {
            this.newStep(JSON.parse(JSON.stringify(this.case)))
          }
        })
      }
    } else {
      this.msgService.error(this.i18nService.fanyi(I18nKey.ErrorEmptySummary))
    }
  }

  reset() {
    this.case = {}
    initCaseField(this.case)
  }

  history() {
    this.historyVisible = true
  }

  editFromHis(item: Case) {
    if (item._id) {
      this.historyVisible = false
      this.caseService.getById(item._id).subscribe(res => {
        this.case = res.data
        this.updateCaseRoute()
      })
    }
  }

  copyFromHis(item: Case) {
    if (item._id) {
      this.historyVisible = false
      this.caseService.getById(item._id).subscribe(res => {
        this.case = res.data
        this.case._id = undefined
        this.case._creator = undefined
        this.modelChange()
      })
    }
  }

  updateCaseRoute() {
    this.caseRoute = `/case/${this.group}/${this.project}/${this.case._id}`
  }

  /**
   * 处理格式满足后端数据结构和类型需求
   */
  preHandleRequest(cs: Case) {
    const c: Case = JSON.parse(JSON.stringify(cs))
    c._id = undefined
    c._creator = undefined
    c.creator = undefined
    c.createdAt = undefined
    c.group = this.group || cs.group
    c.project = this.project || cs.project
    // handle reqeust
    const req = c.request
    if (req && req.body) {
      if (!req.rawUrl) {
        this.msgService.error(this.i18nService.fanyi(I18nKey.ErrorInvalidUrl))
        return
      }
      req.body.forEach(item => {
        if (HttpContentTypes.isNeedTransform(item.contentType) && item.data) {
          if (typeof item.data !== 'string') {
            item.data = JSON.stringify(item.data)
          }
        }
      })
    }
    // assert
    if (c.assert) {
      try {
        if (typeof c.assert === 'string') {
          c.assert = JSON.parse(c.assert)
        }
      } catch (error) {
        console.error(error)
        this.msgService.error(this.i18nService.fanyi(I18nKey.ErrorInvalidAssert))
        return
      }
    } else {
      c.assert = {}
    }
    // generator
    if (c.generator && c.generator.list && c.generator.list.length > 0) {
      c.generator.list.forEach(item => {
        if (item.assert) {
          try {
            if (typeof item.assert === 'string') {
              item.assert = JSON.parse(item.assert)
            }
          } catch (error) {
            console.error(error)
            this.msgService.error(this.i18nService.fanyi(I18nKey.ErrorInvalidAssert))
            return
          }
        } else {
          item.assert = {}
        }
      })
    }
    return c
  }

  ngOnInit(): void {
    if (this.route.parent && this.route.parent.parent) {
      // if it was created from NzDrawerService, this.route.parent will be null
      this.route.parent.parent.params.subscribe(params => {
        this.group = params['group']
        this.project = params['project']
      })
      this.route.parent.params.subscribe(params => {
        const caseId = params['caseId']
        if (caseId) { // edit
          this.isInNew = false
          this.caseService.getById(caseId).subscribe(res => {
            this.case = res.data
            this.case._id = caseId
            this.updateCaseRoute()
          })
        }
      })
    }
    if (this.assertions && this.assertions.length === 0) {
      this.configService.getBasics().subscribe(res => {
        this.assertions = res.data.assertions
        this.transforms = res.data.transforms
      })
    }
  }

  ngOnDestroy() {
    if (this.testWs) {
      this.testWs.close()
      this.testWs = null
    }
  }
}

// make ui ready and reset data model
export function initCaseField(cs: Case) {
  const hashObj = hashToObj<CaseModelHashObj>()
  let rawUrl = ''
  if (hashObj.domain) {
    rawUrl = `${hashObj.domain}${hashObj.urlPath || ''}`
  }
  cs.summary = ''
  cs.description = ''
  cs.createdAt = undefined
  cs.creator = undefined
  cs.labels = []
  cs.assert = ''
  cs.request = {
    method: hashObj.method || METHODS[0],
    host: hashObj.domain || '',
    urlPath: hashObj.urlPath || '',
    rawUrl: rawUrl,
    contentType: '',
    body: [],
    auth: { type: '', data: {} }
  }
  location.hash = ''
  cs.exports = []
}

export interface CaseModelHashObj {
  domain?: string
  method?: string
  urlPath?: string
}
