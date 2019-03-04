import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { DtabItem, LinkerdConfigServer, LinkerdService } from 'app/api/service/linkerd.service'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-linkerd-http',
  templateUrl: './linkerd-http.component.html',
})
export class LinkerdHttpComponent implements OnInit {

  servers: LinkerdConfigServer[] = []
  all: DtabItem[] = []
  ownedItems: DtabItem[] = []
  unownedItems: DtabItem[] = []
  group: string
  project: string
  showOwned = true
  _server: string
  @Input()
  set server(val: string) {
    this._server = val
  }
  get server() {
    return this._server
  }
  @Output() serverChange = new EventEmitter<string>()

  constructor(
    private linkerdService: LinkerdService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private route: ActivatedRoute,
  ) { }

  addNew() {
    if (this.group && this.project && this._server) {
      this.ownedItems.push({ group: this.group, project: this.project, port: '80' })
      this.all = [...this.ownedItems, ...this.unownedItems]
    }
  }

  save() {
    if (this.group && this.project && this._server) {
      const items = [...this.ownedItems, ...this.unownedItems]
      this.linkerdService.putV1Http(this.group, this.project, items, this._server).subscribe(res => {
        this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      })
    }
  }

  removeOwned(index: number) {
    this.ownedItems.splice(index, 1)
    this.all = [...this.ownedItems, ...this.unownedItems]
  }

  proxyServerChange() {
    this.serverChange.emit(this._server)
    this.loadDtabs()
  }

  loadDtabs() {
    if (this.group && this.project && this._server) {
      this.linkerdService.getV1Http(this.group, this.project, this._server).subscribe(res => {
        const owned: DtabItem[] = []
        const unOwned: DtabItem[] = []
        res.data.forEach(item => {
          if (item.owned) {
            owned.push(item)
          } else {
            unOwned.push(item)
          }
        })
        this.ownedItems = owned
        this.unownedItems = unOwned
        this.all = [...this.ownedItems, ...this.unownedItems]
      })
    }
  }

  loadServers() {
    this.linkerdService.getProxyServers().subscribe(res => {
      this.servers = res.data
      // if (!this._server && this.servers.length > 0) {
      //   this._server = this.servers[0].tag
      //   this.serverChange.emit(this._server)
      // }
      this.loadDtabs()
    })
  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      if (params['group'] && params['project']) {
        this.group = params['group']
        this.project = params['project']
        this.loadServers()
      }
    })
    this.route.parent.parent.params.subscribe(params => {
      if (params['group'] && params['project']) {
        this.group = params['group']
        this.project = params['project']
        this.loadServers()
      }
    })
  }
}
