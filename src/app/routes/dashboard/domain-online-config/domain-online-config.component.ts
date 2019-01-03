import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { OnlineService } from 'app/api/service/online.service'
import { DomainOnlineConfig, FieldPattern, METHODS, RestApiOnlineLog } from 'app/model/es.model'
import { PageSingleModel } from 'app/model/page.model'
import { NzDrawerRef, NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-domain-online-config',
  templateUrl: './domain-online-config.component.html',
  styles: [`
    div.bottom-btns {
      float: right;
      padding-top: 4px;
      padding-right: 32px;
    }
  `]
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
  exOnly: FieldPattern[] = []
  aggs: FieldPattern[] = []
  inOnly: FieldPattern[] = []
  config: DomainOnlineConfig = {
    maxApiCount: 2000,
    inclusions: [],
    exclusions: [],
  }
  methods = METHODS
  exMethods: string[] = []
  domainTotal: number
  previewLoading = false
  apiItems: RestApiOnlineLog[] = []
  list: RestApiOnlineLog[] = []
  defaultExSuffixes = [
    '.html', '.js', '.css', '.php', '.log', '.htaccess', '.ini', '.DS_store', '.git',
    '.config', '.md', '.ico', '.mp3', '.mp4', '.jsp'
  ]
  @Input()
  set data(val: { domain: string, domainTotal: number, tag: string }) {
    this.config.domain = val.domain || ''
    this.config.tag = val.tag || ''
    this.domainTotal = val.domainTotal
    if (this.config.domain) {
      this.onlineService.getDomainConfig(this.config.domain).subscribe(res => {
        if (res.data) {
          this.config = res.data
          if (this.config.minReqCount === 0) {
            this.config.minReqCount = undefined
          }
          if (this.config.exMethods) {
            this.exMethods = this.config.exMethods.map(m => m.name)
          }
          const inclusions = this.config.inclusions
          const exclusions = this.config.exclusions
          const onlyInPatterns: FieldPattern[] = []
          const onlyExPatterns: FieldPattern[] = []
          const aggsPatterns: FieldPattern[] = []
          const inMap: { [k: string]: FieldPattern } = {}
          if (inclusions) {
            inclusions.forEach(item => {
              if (item.alias) { // need aggregation
                inMap[item.value] = item
                aggsPatterns.push(item)
              } else {
                onlyInPatterns.push(item)
              }
            })
          }
          if (exclusions) {
            exclusions.forEach(item => {
              if (!inMap[item.value]) { // do not need aggregation
                onlyExPatterns.push(item)
              }
            })
          }
          this.inOnly = onlyInPatterns
          this.exOnly = onlyExPatterns
          this.aggs = aggsPatterns
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

  addSuffixes() {
    this.config.exSuffixes = this.defaultExSuffixes.join(',')
  }

  addAggs() {
    this.aggs.push({
      type: 'term'
    })
  }

  removeAggs(i: number) {
    this.aggs.splice(i, 1)
  }

  addInclusion() {
    this.inOnly.push({
      type: 'term'
    })
  }

  removeInclusion(i: number) {
    this.inOnly.splice(i, 1)
  }

  addExclusion() {
    this.exOnly.push({
      type: 'term'
    })
  }

  removeExclusion(i: number) {
    this.exOnly.splice(i, 1)
  }

  save() {
    this.preHandleConfig()
    this.onlineService.putDomainConfig(this.config).subscribe(res => {
      this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
    })
  }

  preview() {
    this.previewLoading = true
    this.pageIndex = 1
    this.preHandleConfig()
    this.onlineService.peviewDomainConfigResults({ config: this.config, domainTotal: this.domainTotal }).subscribe(res => {
      this.apiItems = res.data.sort((a, b) => b.count - a.count)
      this.pageTotal = this.apiItems.length
      this.previewLoading = false
      this.setListData()
    }, err => this.previewLoading = false)
  }

  preHandleConfig() {
    try {
      this.config.maxApiCount = parseInt(this.config.maxApiCount.toString(), 10)
      this.config.minReqCount = parseInt(this.config.minReqCount.toString(), 10)
    } catch (error) {
    }
    if (this.exMethods && this.exMethods.length > 0) {
      this.config.exMethods = this.exMethods.map(m => {
        return { name: m }
      })
    } else {
      this.config.exMethods = []
    }
    const exclusions: FieldPattern[] = []
    const inclusions: FieldPattern[] = []
    exclusions.push(...this.exOnly)
    this.aggs.forEach(item => { // both add inclusion and exclusion
      const copyItem = { ...item }
      copyItem.alias = ''
      exclusions.push(copyItem)
      inclusions.push(item)
    })
    this.inOnly.forEach(item => {
      inclusions.push(item)
    })
    this.config.inclusions = inclusions
    this.config.exclusions = exclusions
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
