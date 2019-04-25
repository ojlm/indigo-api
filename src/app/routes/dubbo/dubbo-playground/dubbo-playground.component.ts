import { Location } from '@angular/common'
import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { CaseService } from 'app/api/service/case.service'
import {
  DubboInterface,
  DubboProvider,
  DubboService,
  GetInterfaceMethodParams,
  GetInterfacesMessage,
  InterfaceMethodParams,
  ParameterType,
} from 'app/api/service/dubbo.service'
import { ActorEvent, ActorEventType } from 'app/model/api.model'
import { Assertion, DubboRequest } from 'app/model/es.model'
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

  group = ''
  project = ''
  tabBarStyle = {
    'background-color': 'snow',
    'margin': '0px',
    'height': '40px'
  }
  isSending = false
  isInNew = false
  isInDrawer = false
  isSaved = true
  assertions: Assertion[] = []
  tabIndex = 0
  logSubject = new Subject<ActorEvent<string>>()
  echoSubject = new Subject<string>()
  telnetDrawerVisible = false
  drawerWidth = calcDrawerWidth(0.4)
  methodsDrawerVisible = false
  interfaceSearchTxt = ''
  zkConnectString = ''
  interfacesMsg: GetInterfacesMessage = { path: '/dubbo' }
  rawInterfaces: DubboInterface[] = []
  interfaces: DubboInterface[] = []
  rawProviders: DubboProvider[] = []
  providers: DubboProvider[] = []
  rawMethods: string[] = []
  methods: string[] = []
  selectedProvider: DubboProvider = {}
  parameterTypes: ParameterType[] = [{ type: '' }]
  request: DubboRequest = {}
  height = `${window.innerHeight - 70}px`
  subHeight = `${window.innerHeight - 148}px`
  tableScroll = { y: `${window.innerHeight - 160}px` }
  jsonRoEditorOption = { ...this.monocoService.getJsonOption(true), theme: this.monocoService.THEME_WHITE }
  jsonEditorOption = { ...this.monocoService.getJsonOption(false), theme: this.monocoService.THEME_WHITE }
  requestStr = '[]'
  assertionsStr = ''
  responseStr = ''
  resultStr = ''
  testWs: WebSocket
  paramsCache: InterfaceMethodParamsCache = {}
  @Output() newStepEvent = new EventEmitter<DubboRequest>()
  @Output() updateStepEvent = new EventEmitter<DubboRequest>()
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
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private i18nService: I18NService,
    private el: ElementRef<HTMLDivElement>,
  ) { }

  modelChange() {
    this.isSaved = false
  }

  send() {
    const newReq = this.preHandleRequest(this.request)
    if (null != newReq) {
      this.isSending = true
      this.dubboService.test({ id: this.request._id, request: newReq }).subscribe(res => {
        this.responseStr = formatJson(res.data.context)
        this.resultStr = formatJson({ statis: res.data.statis, result: res.data.result })
        this.isSending = false
      }, err => this.isSending = false)
    }
  }

  save() {
    if (this.request.summary) {
      const newReq = this.preHandleRequest(this.request)
      if (newReq) {
        if (this.request._id) {
          this.dubboService.update(this.request._id, newReq).subscribe(res => {
            this.isSaved = true
            if (this.updateStepEvent) {
              this.updateStepEvent.emit(this.toStepItem())
            }
            this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
          })
        } else {
          this.dubboService.index(newReq).subscribe(res => {
            this.request._id = res.data.id
            this.isSaved = true
            if (this.newStepEvent) {
              this.newStepEvent.emit(this.toStepItem())
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
          if (this.newStepEvent) {
            this.newStepEvent.emit(this.toStepItem())
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

  private toStepItem() {
    const step: DubboRequest = {
      _id: this.request._id,
      summary: this.request.summary,
      description: this.request.description,
    }
    return step
  }

  zkChange() {
    const pieces = this.zkConnectString.split(':')
    if (pieces.length === 2) {
      this.interfacesMsg.zkAddr = pieces[0]
      this.interfacesMsg.zkPort = parseInt(pieces[1], 10)
      this.request.zkAddr = this.interfacesMsg.zkAddr
      this.request.zkPort = this.interfacesMsg.zkPort
    }
  }

  zkPathChange() {
    this.request.path = this.interfacesMsg.path
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
        this.request.interface = this.interfaceSearchTxt
      } else {
        this.interfaces = filter
      }
    } else {
      this.interfaces = [...this.rawInterfaces]
    }
  }

  getInterfaces() {
    this.dubboService.getInterfaces(this.interfacesMsg).subscribe(res => {
      this.rawInterfaces = res.data
      this.interfaces = [...this.rawInterfaces]
    })
  }

  getProviders(item: DubboInterface) {
    if (item.zkAddr && item.ref) {
      this.request.interface = item.ref
      this.selectedProvider = {}
      this.request.method = ''
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
      this.request.address = this.selectedProvider.address
      let port: number
      try {
        port = this.selectedProvider.port
      } catch (error) {
      }
      this.request.port = port
      this.rawMethods = this.selectedProvider.methods || []
      this.methods = [...this.rawMethods]
      if (this.methods.length > 0) {
        this.request.method = this.methods[0]
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
      this.request.address = ''
      this.request.port = undefined
      this.methods = []
    }
  }

  methodChange() {
    const method = this.request.method
    if (method) {
      const interfaceCache = this.paramsCache[this.request.interface]
      if (interfaceCache) {
        this.request.parameterTypes = interfaceCache[method]
        if (this.request.parameterTypes) {
          this.parameterTypes = this.request.parameterTypes
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
    if (this.request.port) {
      port = parseInt(this.request.port.toString(), 10)
    }
    if (!port || isNaN(port)) {
      this.msgService.error('port must be a number')
      return null
    } else {
      try {
        const newReq: DubboRequest = JSON.parse(JSON.stringify(req))
        const reqBody = JSON.parse(this.requestStr)
        newReq.args = { args: reqBody }
        newReq.parameterTypes = this.parameterTypes.filter(item => item.type)
        newReq._id = undefined
        newReq._creator = undefined
        newReq.creator = undefined
        newReq.createdAt = undefined
        newReq.group = this.group
        newReq.project = this.project
        newReq.port = port
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

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
    })
    this.route.parent.params.subscribe(params => {
      const docId = params['dubboId']
      if (docId) {
        this.isInNew = true
        initRequestField(this.request)
        this.dubboService.getById(docId).subscribe(res => {
          this.request = res.data
          this.request._id = docId
          this.interfaceSearchTxt = this.request.interface
          this.selectedProvider = {
            address: this.request.address,
            port: this.request.port
          }
          this.providers = [this.selectedProvider]
          if (this.request.zkAddr && this.request.zkPort) {
            this.zkConnectString = `${this.request.zkAddr}:${this.request.zkPort}`
            this.interfacesMsg = {
              zkAddr: this.request.zkAddr,
              zkPort: this.request.port,
              path: this.request.path
            }
          }
          this.methods = [this.request.method]
          this.requestStr = formatJson(this.request.args.args, 2)
          this.parameterTypes = this.request.parameterTypes
          this.assertionsStr = formatJson(this.request.assert, 2)
        })
      } else {
        if (!this.request._id) {
          initRequestField(this.request)
        }
      }
    })
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
