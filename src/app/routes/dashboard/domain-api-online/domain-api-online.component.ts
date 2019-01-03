import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AggsItem } from 'app/api/service/base.service'
import {
  OnlineService,
  QueryDomain,
  QueryDomainWildcard,
  QueryOnlineApi,
  QueryOnlineApiResponse,
  QueryOnlineApiSubjectSearch,
} from 'app/api/service/online.service'
import { ApiRes } from 'app/model/api.model'
import { NameValue } from 'app/model/common.model'
import { DomainOnlineLog, METHODS, RestApiOnlineLog } from 'app/model/es.model'
import { PageSingleModel } from 'app/model/page.model'
import { calcDrawerWidth } from 'app/util/drawer'
import { hashToObj, objToHash } from 'app/util/urlutils'
import { NzDrawerService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { ApiMetricsTrendComponent } from '../api-metrics-trend/api-metrics-trend.component'
import { DomainOnlineConfigComponent } from '../domain-online-config/domain-online-config.component'

@Component({
  selector: 'app-domain-api-online',
  templateUrl: './domain-api-online.component.html',
})
export class DomainApiOnlineComponent extends PageSingleModel implements OnInit {

  drawerWidth = calcDrawerWidth()
  methods = METHODS
  sortFields = [
    { label: 'count', value: 'count' },
    { label: 'min', value: 'metrics.min' },
    { label: 'avg', value: 'metrics.avg' },
    { label: 'max', value: 'metrics.max' },
    { label: 'p25', value: 'metrics.p25' },
    { label: 'p50', value: 'metrics.p50' },
    { label: 'p75', value: 'metrics.p75' },
    { label: 'p90', value: 'metrics.p90' },
    { label: 'p95', value: 'metrics.p95' },
    { label: 'p99', value: 'metrics.p99' },
    { label: 'p999', value: 'metrics.p999' },
  ]
  view1: any[] = [window.innerWidth, Math.floor(window.innerHeight - 150)]
  view2: any[] = [this.drawerWidth - 20, Math.floor((window.innerHeight - 40) / 2)]
  colorScheme = {
    domain: [
      '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064'
    ]
  }
  domain: DomainOnlineLog
  dates: AggsItem[] = []
  domains: DomainOnlineLog[] = []
  loading = false
  apiItems: RestApiOnlineLog[] = []
  // all domains
  domainsResult: NameValue[] = [{ name: 'indigo', value: 0 }]
  domainsCoverateResult: NameValue[] = [{ name: 'indigo', value: 0 }]
  // single domain series days
  domainChartDrawerVisible = false
  domainResult: NameValue[] = []
  domainCoverageResults: NameValue[] = [{ name: 'indigo', value: 0 }]
  queryDomain: QueryDomain = {
    size: 50,
  }
  queryApi: QueryOnlineApi = {
    size: 20,
  }
  showDomainApis = false
  queryDomainSubject: Subject<QueryDomainWildcard>
  queryApiSubject: Subject<QueryOnlineApiSubjectSearch>
  hashObj: HashObj = { showCovRate: false }
  @HostListener('window:resize')
  resize() {
    this.view1 = [window.innerWidth, Math.floor(window.innerHeight - 150)]
    this.view2 = [this.drawerWidth - 20, Math.floor((window.innerHeight - 40) / 2)]
  }

  constructor(
    private onlineService: OnlineService,
    private drawerService: NzDrawerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super()
    const domainResponse = new Subject<ApiRes<DomainOnlineLog[]>>()
    this.queryDomainSubject = this.onlineService.queryDomainWildcardSubject(domainResponse)
    domainResponse.subscribe(res => {
      this.domains = res.data.list
      if (this.domain) {
        res.data.list.forEach(item => {
          if (item.name === this.domain.name && item.tag === this.domain.tag) {
            this.domain = item
          }
        })
      }
    })
    const apiResponse = new Subject<ApiRes<QueryOnlineApiResponse>>()
    this.queryApiSubject = this.onlineService.queryApiSubject(apiResponse)
    apiResponse.subscribe(res => {
      if (res.data.domain) {
        const domainCountResult: NameValue[] = []
        const domainCoverageResults: NameValue[] = []
        res.data.domain.list.forEach(item => {
          domainCountResult.push({ name: item.date, value: item.count })
          let cov = 0
          if (item.coverage && item.coverage > 0) {
            cov = item.coverage / 100
          }
          domainCoverageResults.push({ name: item.date, value: cov })
        })
        this.domainResult = domainCountResult
        this.domainCoverageResults = domainCoverageResults
      }
      this.pageTotal = res.data.apis.total
      this.apiItems = res.data.apis.list
      this.showDomainApis = true
      this.loading = false
    }, err => this.loading = false)
  }

  perfResults(item: RestApiOnlineLog): NameValue[] {
    const metricsKeys = ['p25', 'p50', 'p75', 'p95', 'p99', 'p999']
    if (item.metrics) {
      return metricsKeys.map(name => {
        return { name: name, value: item.metrics[name] || 0 }
      })
    } else {
      return metricsKeys.map(name => {
        return { name: name, value: 0 }
      })
    }
  }

  checkChange(checked: boolean) {
    objToHash(this.hashObj)
  }

  showApiPerfTrend(item: RestApiOnlineLog) {
    const drawerRef = this.drawerService.create({
      nzTitle: `${item.method} ${item.urlPath}`,
      nzContent: ApiMetricsTrendComponent,
      nzContentParams: {
        data: item
      },
      nzBodyStyle: {
        'padding': '8px'
      },
      nzWidth: calcDrawerWidth()
    })
    drawerRef.afterClose.subscribe(data => {
    })
  }

  showDomainSyncSetting() {
    const domainCount = this.domainResult.find(item => item.name === this.queryDomain.date)
    if (domainCount) {
      const drawerRef = this.drawerService.create({
        nzTitle: `${this.domain.tag ? `${this.domain.tag}: ` : ''}${this.domain.name}(${domainCount.value.toLocaleString()})`,
        nzContent: DomainOnlineConfigComponent,
        nzContentParams: {
          data: {
            domain: this.domain.name,
            domainTotal: domainCount.value
          }
        },
        nzClosable: false,
        nzBodyStyle: {
          'padding': '8px'
        },
        nzWidth: calcDrawerWidth()
      })
      drawerRef.afterClose.subscribe(data => {
      })
    }
  }

  showDomainCharts() {
    this.domainChartDrawerVisible = true
  }

  dateChange() {
    this.hashObj.date = this.queryDomain.date
    objToHash(this.hashObj)
    this.queryApi.date = this.queryDomain.date
    if (this.showDomainApis && this.queryApi.date) {
      this.loadDomainApiData()
    } else {
      this.domain = undefined
      this.queryDomain.names = []
      this.queryApi.domain = ''
      this.showDomainApis = false
      this.loadData()
    }
  }

  domainChange(resetApiQuery: boolean = true) {
    if (this.domain && this.domain.name) {
      this.hashObj.domain = this.domain.name
      this.hashObj.tag = this.domain.tag
      this.queryDomain.names = [this.domain.name]
      this.queryApi.domain = this.domain.name
      this.queryApi.tag = this.domain.tag
    } else {
      delete this.hashObj.domain
      delete this.hashObj.tag
      this.queryDomain.names = undefined
      this.queryApi.domain = undefined
      this.queryApi.tag = undefined
      this.showDomainApis = false
    }
    objToHash(this.hashObj)
    if (resetApiQuery) {
      this.queryApi.method = undefined
      this.queryApi.urlPath = undefined
    }
    this.pageIndex = 1
    this.domainResult = []
    this.loadDomainApiData(true)
  }

  onDomainSelect(item: NameValue | string) {
    let domain = ''
    let tag = ''
    let splits = []
    if (typeof item === 'string') {
      splits = item.split(':')
    } else {
      splits = item.name.split(':')
    }
    if (splits.length === 2) {
      tag = splits[0]
      domain = splits[1]
    } else {
      domain = splits[0]
    }
    this.setCurrDomainWhenSelect(domain, tag)
    this.domainChange()
  }

  setCurrDomainWhenSelect(domain: string, tag: string) {
    const index = this.domains.findIndex(d => {
      if (tag) {
        return d.tag === tag && d.name === domain
      } else {
        return d.name === domain
      }
    })
    if (-1 === index) {
      this.domain = { name: domain, tag: tag }
      this.searchDomain(domain, tag)
    } else {
      this.domain = this.domains[index]
    }
  }

  onDomainDateSelect(item: NameValue) {
    if (typeof item === 'string') {
      if (item !== this.queryDomain.date) {
        this.queryDomain.date = item
        this.dateChange()
      }
    } else {
      if (item.name !== this.queryDomain.date) {
        this.queryDomain.date = item.name
        this.dateChange()
      }
    }
  }

  viewItem(item: RestApiOnlineLog) {
    window.open(`http://${item.domain}${item.urlPath}`)
  }

  searchDomain(domain: string, tag: string) {
    if (domain) {
      this.queryDomainSubject.next({ domain: domain, tag: tag, date: this.queryDomain.date })
    }
  }

  urlPathChange() {
    this.hashObj.urlPath = this.queryApi.urlPath
    objToHash(this.hashObj)
    this.reloadDomainApiData()
  }

  reloadDomainApiData() {
    this.pageIndex = 1
    this.loadDomainApiData()
  }

  loadDomainApiData(hasDomain = false) {
    if (this.queryApi.domain && this.queryApi.date) {
      this.loading = true
      this.queryApiSubject.next({
        query: { ...this.queryApi, ...this.toPageQuery() },
        hasDomain: this.domainResult.length === 0 || hasDomain
      })
    }
  }

  pageChange() {
    this.loadDomainApiData()
  }

  loadData(init: boolean = false) {
    this.onlineService.queryDomain({ ...this.queryDomain }).subscribe(res => {
      if (res.data.dates && res.data.dates.length > 0) {
        this.dates = res.data.dates
        this.queryDomain.date = this.dates[0].id
        this.hashObj.date = this.queryDomain.date
        objToHash(this.hashObj)
        this.queryApi.date = this.queryDomain.date
        if (init) {
          this.domain = { name: this.hashObj.domain, tag: this.hashObj.tag }
          if (this.hashObj.urlPath) {
            this.queryApi.urlPath = this.hashObj.urlPath
          }
          const index = this.domains.findIndex(d => d.name === this.domain)
          if (-1 === index) {
            this.searchDomain(this.domain.name, this.domain.tag)
          }
          this.domainChange(false)
        }
      }
      if (res.data.count) {
        this.domains = res.data.count.list
        this.domainsResult = res.data.count.list.map(item => {
          return { name: `${item.tag ? `${item.tag}:` : ''}${item.name}`, value: item.count }
        })
      }
      if (res.data.coverage) {
        this.domainsCoverateResult = res.data.coverage.list.map(item => {
          return { name: `${item.tag ? `${item.tag}:` : ''}${item.name}`, value: (item.coverage / 100) }
        })
      }
    })
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

  ngOnInit(): void {
    this.hashObj = hashToObj()
    if (this.hashObj.domain) {
      this.loadData(true)
    } else {
      this.loadData(false)
    }
  }
}

interface HashObj {
  domain?: string
  tag?: string
  date?: string
  showCovRate?: boolean
  urlPath?: string
}
