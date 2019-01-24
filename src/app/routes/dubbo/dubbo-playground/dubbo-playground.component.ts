import { Location } from '@angular/common'
import { Component, ElementRef, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { I18NService } from '@core/i18n/i18n.service'
import {
  DubboInterface,
  DubboProvider,
  DubboService,
  GenericRequest,
  GetInterfaceMethodParams,
  GetInterfacesMessage,
  InterfaceMethodParams,
} from 'app/api/service/dubbo.service'
import { ActorEvent, ActorEventType } from 'app/model/api.model'
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
      border: 1px solid lightgray;
      border-radius: 8px;
      padding: 10px;
    }
    .body-panel {
      height: 100%;
    }
  `]
})
export class DubboPlaygroundComponent implements OnInit {

  LOCAL_KEY = 'DUBBO_ZK'
  logSubject = new Subject<ActorEvent<string>>()
  echoSubject = new Subject<string>()
  telnetDrawerVisible = false
  drawerWidth = calcDrawerWidth(0.4)
  methodsDrawerVisible = false
  interfaceSearchTxt = ''
  interfacesMsg: GetInterfacesMessage = {}
  rawInterfaces: DubboInterface[] = []
  interfaces: DubboInterface[] = []
  rawProviders: DubboProvider[] = []
  providers: DubboProvider[] = []
  rawMethods: string[] = []
  methods: string[] = []
  selectedProvider: DubboProvider = {}
  parameterTypes: ParameterType[] = [{ type: '' }]
  request: GenericRequest = {}
  height = `${window.innerHeight - 70}px`
  subHeight = `${window.innerHeight - 148}px`
  tableScroll = { y: `${window.innerHeight - 160}px` }
  jsonRoEditorOption = { ...this.monocoService.getJsonOption(true), theme: this.monocoService.THEME_WHITE }
  jsonEditorOption = { ...this.monocoService.getJsonOption(false), theme: this.monocoService.THEME_WHITE }
  requestBody = '[]'
  responseBody = ''
  testWs: WebSocket
  paramsCache: InterfaceMethodParamsCache = {}
  @HostListener('window:resize')
  resize() {
    this.height = `${window.innerHeight - 70}px`
    this.subHeight = `${window.innerHeight - 148}px`
    this.tableScroll = { y: `${window.innerHeight - 160}px` }
  }

  constructor(
    private dubboService: DubboService,
    private monocoService: MonacoService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private i18nService: I18NService,
    private el: ElementRef<HTMLDivElement>,
  ) { }

  test() {
    let reqBody: any[] = []
    try {
      reqBody = JSON.parse(this.requestBody)
      this.request.args = reqBody
      this.request.parameterTypes = this.parameterTypes.filter(item => item.type).map(item => item.type)
      this.dubboService.test(this.request).subscribe(res => {
        this.responseBody = formatJson(res.data)
      })
    } catch (error) {
    }
  }

  zkChange() {
    try {
      localStorage.setItem(this.LOCAL_KEY, JSON.stringify(this.interfacesMsg))
    } catch (error) {
    }
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
          methodParamCache[method.method] = method.params
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
          this.parameterTypes = this.request.parameterTypes.map(t => {
            return { type: t }
          })
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

  ngOnInit(): void {
    try {
      const json = localStorage.getItem(this.LOCAL_KEY)
      if (json) {
        this.interfacesMsg = JSON.parse(json) as GetInterfacesMessage
      }
    } catch (error) {
    }
  }
}

export interface ParameterType {
  type?: string
}

export interface MethodParams {
  [method: string]: string[]
}

export interface InterfaceMethodParamsCache {
  [ref: string]: MethodParams
}
