import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { OnlineService } from 'app/api/service/online.service'
import { DomainOnlineConfig, RestApiOnlineLog } from 'app/model/es.model'
import { PageSingleModel } from 'app/model/page.model'
import { NzDrawerRef, NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-domain-online-config',
  templateUrl: './domain-online-config.component.html',
})
export class DomainOnlineConfigComponent extends PageSingleModel implements OnInit {

  configFieldType = [
    {
      label: 'item-term',
      value: 'term',
    },
    {
      label: 'item-wildcard',
      value: 'wildcard',
    },
    {
      label: 'item-regex',
      value: 'regex',
    }
  ]
  config: DomainOnlineConfig = {
    maxApiCount: 2000,
    inclusions: [],
    exclusions: [],
  }
  domainTotal: number
  previewLoading = false
  apiItems: RestApiOnlineLog[] = []
  list: RestApiOnlineLog[] = []
  @Input()
  set data(val: { domain: string, domainTotal: number }) {
    this.config.domain = val.domain || ''
    this.domainTotal = val.domainTotal
    if (this.config.domain) {
      this.onlineService.getDomainConfig(this.config.domain).subscribe(res => {
        if (res.data) {
          this.config = res.data
        }
      })
    }
  }

  constructor(
    private onlineService: OnlineService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private drawerRef: NzDrawerRef<any>,
    private route: ActivatedRoute,
    private router: Router,
  ) { super() }

  addInclusion() {
    this.config.inclusions.push({
      type: 'term'
    })
  }

  removeInclusion(i: number) {
    this.config.inclusions.splice(i, 1)
  }

  addExclusion() {
    this.config.exclusions.push({
      type: 'term'
    })
  }

  removeExclusion(i: number) {
    this.config.exclusions.splice(i, 1)
  }

  save() {
    this.config.maxApiCount = parseInt(this.config.maxApiCount.toString(), 10)
    this.onlineService.putDomainConfig(this.config).subscribe(res => {
      this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
    })
  }

  preview() {
    this.previewLoading = true
    this.pageIndex = 1
    this.onlineService.peviewDomainConfigResults({ config: this.config, domainTotal: this.domainTotal }).subscribe(res => {
      this.apiItems = res.data.sort((a, b) => b.count - a.count)
      this.pageTotal = this.apiItems.length
      this.previewLoading = false
      this.setListData()
    }, err => this.previewLoading = false)
  }

  methodTagColor(item: RestApiOnlineLog) {
    switch (item.method) {
      case 'GET':
        return 'green'
      case 'DELETE':
        return 'red'
      case 'POST':
        return 'cyan'
      case 'PUT':
        return 'blue'
      default:
        return 'purple'
    }
  }

  formatNumber(item: RestApiOnlineLog) {
    if (item && item.count) {
      return item.count.toLocaleString()
    } else {
      return 0
    }
  }

  pageChange() {
    this.setListData()
  }

  setListData() {
    const start = (this.pageIndex - 1) * this.pageSize
    this.list = this.apiItems.slice(start, start + this.pageSize)
  }

  ngOnInit(): void {
  }
}
