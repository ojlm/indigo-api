import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { DtabItem, LinkerdService } from 'app/api/service/linkerd.service'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-linkerd-http',
  templateUrl: './linkerd-http.component.html',
})
export class LinkerdHttpComponent implements OnInit {

  all: DtabItem[] = []
  ownedItems: DtabItem[] = []
  unownedItems: DtabItem[] = []
  group: string
  project: string
  showOwned = true

  constructor(
    private linkerdService: LinkerdService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private route: ActivatedRoute,
  ) { }

  addNew() {
    if (this.group && this.project) {
      this.ownedItems.push({ group: this.group, project: this.project, port: '80' })
      this.all.length = this.all.length + 1
    }
  }

  save() {
    if (this.group && this.project) {
      const items = [...this.ownedItems, ...this.unownedItems]
      this.linkerdService.putV1Http(this.group, this.project, items).subscribe(res => {
        this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      })
    }
  }

  removeOwned(index: number) {
    this.ownedItems.splice(index, 1)
    this.all.length = this.all.length - 1
  }

  loadData() {
    if (this.group && this.project) {
      this.linkerdService.getV1Http(this.group, this.project).subscribe(res => {
        this.all.length = res.data.length
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
      })
    }
  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      if (params['group'] && params['project']) {
        this.group = params['group']
        this.project = params['project']
        this.loadData()
      }
    })
    this.route.parent.parent.params.subscribe(params => {
      if (params['group'] && params['project']) {
        this.group = params['group']
        this.project = params['project']
        this.loadData()
      }
    })
  }
}
