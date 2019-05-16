import { Component, HostListener, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { CaseService } from 'app/api/service/case.service'
import {
  DubboInterface,
  DubboProvider,
  DubboResult,
  DubboService,
  GetInterfaceMethodParams,
  InterfaceMethodParams,
  ParameterType,
} from 'app/api/service/dubbo.service'
import { ActorEvent, ActorEventType } from 'app/model/api.model'
import { Assertion, CaseReportItemMetrics, CaseStatis, DubboRequest } from 'app/model/es.model'
import { calcDrawerWidth } from 'app/util/drawer'
import { formatJson } from 'app/util/json'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-dubbo-playground',
  templateUrl: './dubbo-playground.component.html',
  styles: [`
    .col-panel {
      height: 100%;
    }
    .body-panel {
      height: 100%;
    }
  `]
})
export class DubboPlaygroundComponent implements OnInit {

  @Input() isInDrawer = false
  @Input() group = ''
  @Input() project = ''
  tabBarStyle = {
    'background-color': '#fadb140a',
    'margin': '0px',
    'height': '40px'
  }
  isSending = false
  isSaved = true
  assertions: Assertion[] = []
  tabIndex = 0
  logSubject = new Subject<ActorEvent<string>>()
  echoSubject = new Subject<string>()
  telnetDrawerVisible = false
  drawerWidth = calcDrawerWidth(0.4)
  methodsDrawerVisible = false
  interfaceSearchTxt = ''
  rawInterfaces: DubboInterface[] = []
  interfaces: DubboInterface[] = []
  rawProviders: DubboProvider[] = []
  providers: DubboProvider[] = []
  rawMethods: string[] = []
  methods: string[] = []
  selectedProvider: DubboProvider = {}
  parameterTypes: ParameterType[] = [{ type: '' }]
  request: DubboRequest = {
    request: {
      path: '/dubbo'
    },
    exports: []
  }
  height = `${window.innerHeight - 70}px`
  subHeight = `${window.innerHeight - 148}px`
  tableScroll = { y: `${window.innerHeight - 160}px` }
  jsonRoEditorOption = { ...this.monocoService.getJsonOption(true), theme: this.monocoService.THEME_WHITE }
  jsonEditorOption = { ...this.monocoService.getJsonOption(false), theme: this.monocoService.THEME_WHITE }
  metrics: CaseReportItemMetrics = {}
  statis: CaseStatis = {}
  requestStr = '[]'
  renderedRequestStr = ''
  assertionsStr = ''
  responseStr = ''
  resultStr = ''
  testWs: WebSocket
  paramsCache: InterfaceMethodParamsCache = {}
  @Input() newStep: Function
  @Input() updateStep: Function
  @Input()
  set id(docId: string) {
    this.tabIndex = 0
    this.loadDataById(docId)
  }
  @Input()
  set result(result: DubboResult) {
    if (result) {
      this.tabIndex = 6
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
    private dubboService: DubboService,
    private caseService: CaseService,
    private monocoService: MonacoService,
    private msgService: NzMessageService,
    private route: ActivatedRoute,
    private i18nService: I18NService,
  ) {
    initRequestField(this.request)
  }

  modelChange() {
    this.isSaved = false
  }

  send() {
    const newReq = this.preHandleRequest(this.request)
    if (null != newReq) {
      this.isSending = true
      this.dubboService.test({ id: this.request._id, request: newReq }).subscribe(res => {
        this.dealResult(res.data)
        this.tabIndex = 6
        this.isSending = false
      }, err => this.isSending = false)
    }
  }

  dealResult(result: DubboResult) {
    this.renderedRequestStr = formatJson(result.request, 2)
    this.responseStr = formatJson(result.response.body, 2)
    this.resultStr = formatJson(result.result, 2)
    this.statis = result.statis || {}
    this.metrics = result.metrics || {}
  }

  save() {
    if (this.request.summary) {
      const newReq = this.preHandleRequest(this.request)
      if (newReq) {
        if (this.request._id) {
          this.dubboService.update(this.request._id, newReq).subscribe(res => {
            this.isSaved = true
            if (this.updateStep) {
              this.updateStep(this.request)
            }
            this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
          })
        } else {
          this.dubboService.index(newReq).subscribe(res => {
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
        this.dubboService.index(newReq).subscribe(res => {
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
    this.msgService.info('TBD')
  }

  telnet() {
    this.telnetDrawerVisible = true
    if (this.selectedProvider.address) {
      if (!this.testWs) {
        this.reConnectTelnet()
      } else if (this.testWs && this.testWs.readyState !== 1) {
        // not open
        this.testWs.close()
        this.testWs = null
        this.reConnectTelnet()
      }
    } else {
      this.logSubject.next({ type: ActorEventType.ERROR, msg: 'Empty address' })
    }
  }

  reConnectTelnet() {
    this.testWs = this.dubboService.newTelnetWs(this.selectedProvider.address, this.selectedProvider.port)
    this.testWs.onopen = (event) => {
      this.testWs.send('help\r\n')
      this.echoSubject.subscribe(cmd => {
        this.testWs.send(`${cmd}\r\n`)
      })
    }
    this.testWs.onmessage = (event) => {
      if (event.data) {
        try {
          const res = JSON.parse(event.data) as ActorEvent<string>
          if (ActorEventType.ITEM === res.type) {
          } else if (ActorEventType.OVER === res.type) {
          } else {
            this.logSubject.next(res)
          }
        } catch (error) {
          this.msgService.error(error)
          this.testWs.close()
        }
      }
    }
  }

  addParameterType() {
    this.parameterTypes.push({ type: '' })
  }

  viewMethods() {
    this.methodsDrawerVisible = true
  }

  removeParameterType(idx: number) {
    this.parameterTypes.splice(idx, 1)
  }

  filterInterfaces() {
    if (this.interfaceSearchTxt) {
      const filter = this.rawInterfaces.filter(item => item.ref.toLowerCase().indexOf(this.interfaceSearchTxt.toLowerCase()) > -1)
      if (filter.length === 0) {
        this.interfaces = [{ ref: this.interfaceSearchTxt }]
        this.request.request.interface = this.interfaceSearchTxt
      } else {
        this.interfaces = filter
      }
    } else {
      this.interfaces = [...this.rawInterfaces]
    }
  }

  getInterfaces() {
    this.dubboService.getInterfaces({
      zkConnectString: this.request.request.zkConnectString,
      path: this.request.request.path
    }).subscribe(res => {
      this.rawInterfaces = res.data
      this.interfaces = [...this.rawInterfaces]
    })
  }

  getProviders(item: DubboInterface) {
    if (item.zkConnectString && item.ref) {
      this.request.request.interface = item.ref
      this.selectedProvider = {}
      this.request.request.method = ''
      this.dubboService.getProviders({ ...item }).subscribe(res => {
        this.rawProviders = res.data
        if (this.rawProviders.length > 0) {
          this.providers = [...this.rawProviders]
          this.selectedProvider = this.rawProviders[0]
          this.providerChange()
        }
      })
    }
  }

  searchProvider(txt: string) {
    if (txt) {
      const p = this.rawProviders.filter(item => {
        return `${item.address}:${item.port}`.indexOf(txt) > -1
      })
      const pieces = txt.split(':')
      if (pieces.length === 2) {
        const newAddr: DubboProvider = {
          address: pieces[0],
          port: parseInt(pieces[1], 10)
        }
        this.providers = [newAddr, ...p]
      } else {
        this.providers = [{ address: txt }, ...p]
      }
    } else {
      this.providers = [...this.rawProviders]
    }
  }

  searchMethod(txt: string) {
    if (txt) {
      this.methods = [txt, ...this.rawMethods.filter(m => m.indexOf(txt) > -1)]
    } else {
      this.methods = [...this.rawMethods]
    }
  }

  providerChange() {
    if (this.selectedProvider) {
      this.request.request.address = this.selectedProvider.address
      let port: number
      try {
        port = this.selectedProvider.port
      } catch (error) {
      }
      this.request.request.port = port
      this.rawMethods = this.selectedProvider.methods || []
      this.methods = [...this.rawMethods]
      if (this.methods.length > 0) {
        this.request.request.method = this.methods[0]
      }
      const msg: GetInterfaceMethodParams = {
        address: this.selectedProvider.address,
        port: this.selectedProvider.port,
        ref: this.selectedProvider.ref
      }
      this.dubboService.getParams(msg).subscribe(res => {
        const params: InterfaceMethodParams = res.data
        const methodParamCache = {}
        params.methods.forEach(method => {
          methodParamCache[method.method] = method.params.map(p => {
            return { type: p }
          })
        })
        this.paramsCache[params.ref] = methodParamCache
        this.methodChange()
      })
    } else {
      this.request.request.address = ''
      this.request.request.port = undefined
      this.methods = []
    }
  }

  methodChange() {
    const method = this.request.request.method
    if (method) {
      const interfaceCache = this.paramsCache[this.request.request.interface]
      if (interfaceCache) {
        this.request.request.parameterTypes = interfaceCache[method]
        if (this.request.request.parameterTypes) {
          this.parameterTypes = this.request.request.parameterTypes
        }
      }
    }
  }

  dubboAddress(item: DubboProvider) {
    let portStr = ''
    if (item.port) {
      portStr = `:${item.port}`
    }
    return `${item.address}${portStr}`
  }

  preHandleRequest(req: DubboRequest) {
    let port: number
    if (this.request.request.port) {
      port = parseInt(this.request.request.port.toString(), 10)
    }
    if (!port || isNaN(port)) {
      this.msgService.error('port must be a number')
      return null
    } else {
      try {
        const newReq: DubboRequest = JSON.parse(JSON.stringify(req))
        newReq.request.args = this.requestStr
        newReq.request.parameterTypes = this.parameterTypes.filter(item => item.type)
        newReq._id = undefined
        newReq._creator = undefined
        newReq.creator = undefined
        newReq.createdAt = undefined
        newReq.group = this.group || req.group
        newReq.project = this.project || req.group
        newReq.request.port = port
        if (this.assertionsStr) {
          newReq.assert = JSON.parse(this.assertionsStr)
        } else {
          newReq.assert = {}
        }
        return newReq
      } catch (error) {
        this.msgService.error('format error')
        return null
      }
    }
  }

  loadDataById(docId: string) {
    this.dubboService.getById(docId).subscribe(res => {
      this.request = res.data
      this.request._id = docId
      this.interfaceSearchTxt = this.request.request.interface
      this.selectedProvider = {
        address: this.request.request.address,
        port: this.request.request.port
      }
      this.providers = [this.selectedProvider]
      this.methods = [this.request.request.method]
      this.requestStr = this.request.request.args
      this.parameterTypes = this.request.request.parameterTypes
      this.assertionsStr = formatJson(this.request.assert, 2)
    })
  }

  ngOnInit(): void {
    if (this.route.parent && this.route.parent.parent) {
      this.route.parent.parent.params.subscribe(params => {
        this.group = params['group']
        this.project = params['project']
      })
      this.route.parent.params.subscribe(params => {
        if (params['dubboId']) {
          this.loadDataById(params['dubboId'])
        }
      })
    }
    if (this.assertions && this.assertions.length === 0) {
      this.caseService.getAllAssertions().subscribe(res => {
        this.assertions = res.data
      })
    }
  }
}

export function initRequestField(request: DubboRequest) {

}

export interface MethodParams {
  [method: string]: ParameterType[]
}

export interface InterfaceMethodParamsCache {
  [ref: string]: MethodParams
}
