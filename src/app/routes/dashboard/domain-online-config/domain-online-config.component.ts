import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { OnlineService } from 'app/api/service/online.service'
import { DomainOnlineConfig } from 'app/model/es.model'
import { NzDrawerRef, NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-domain-online-config',
  templateUrl: './domain-online-config.component.html',
})
export class DomainOnlineConfigComponent implements OnInit {

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
  @Input()
  set data(val: string) {
    this.config.domain = val || ''
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
  ) { }

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

  ngOnInit(): void {
  }
}
