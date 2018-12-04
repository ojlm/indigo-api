import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AggsItem, AggsQuery } from 'app/api/service/base.service'
import {
  OnlineService,
  QueryDomain,
  QueryOnlineApi,
  QueryOnlineApiResponse,
  QueryOnlineApiSubjectSearch,
} from 'app/api/service/online.service'
import { ApiRes } from 'app/model/api.model'
import { NameValue } from 'app/model/common.model'
import { DomainOnlineLog, METHODS, RestApiOnlineLog } from 'app/model/es.model'
import { PageSingleModel } from 'app/model/page.model'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-domain-api-online',
  templateUrl: './domain-api-online.component.html',
})
export class DomainApiOnlineComponent extends PageSingleModel implements OnInit {

  methods = METHODS
  view1: any[] = [window.innerWidth, Math.floor(window.innerHeight - 150)]
  view2: any[] = [window.innerWidth, 64]
  colorScheme = {
    domain: [
      '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064'
    ]
  }
  domain = ''
  dates: AggsItem[] = []
  domains: DomainOnlineLog[] = []
  apiItems: RestApiOnlineLog[] = []
  // all domains
  domainsResult: NameValue[] = [{ name: 'indigo', value: 0 }]
  // single domain series days
  domainResult: NameValue[] = []
  queryDomain: QueryDomain = {
    size: 50,
  }
  queryApi: QueryOnlineApi = {
    size: 20,
  }
  showDomainApis = false
  queryDomainSubject: Subject<AggsQuery>
  queryApiSubject: Subject<QueryOnlineApiSubjectSearch>
  @HostListener('window:resize')
  resize() {
    this.view1 = [window.innerWidth, Math.floor(window.innerHeight - 150)]
    this.view2 = [window.innerWidth, 64]
  }

  constructor(
    private onlineService: OnlineService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super()
    const domainResponse = new Subject<ApiRes<AggsItem[]>>()
    this.queryDomainSubject = this.onlineService.aggDomainTermsSubject(domainResponse)
    domainResponse.subscribe(res => {
      this.domains = res.data.map(item => {
        return { name: item.id }
      })
    })
    const apiResponse = new Subject<ApiRes<QueryOnlineApiResponse>>()
    this.queryApiSubject = this.onlineService.queryApiSubject(apiResponse)
    apiResponse.subscribe(res => {
      if (res.data.domain) {
        this.domainResult = res.data.domain.list.map(domainLog => {
          return { name: domainLog.date, value: domainLog.count }
        })
      }
      this.apiItems = res.data.apis.list
      this.pageTotal = res.data.apis.total
      this.showDomainApis = true
    })
  }

  dateChange() {
    this.queryApi.date = this.queryDomain.date
    if (this.showDomainApis && this.queryApi.date) {
      this.loadDomainApiData()
    } else {
      this.domain = ''
      this.queryDomain.names = []
      this.queryApi.domain = ''
      this.showDomainApis = false
      this.loadData()
    }
  }

  domainChange() {
    if (this.domain) {
      this.queryDomain.names = [this.domain]
      this.queryApi.domain = this.domain
    } else {
      this.queryDomain.names = undefined
      this.queryApi.domain = undefined
      this.showDomainApis = false
    }
    this.queryApi.method = undefined
    this.queryApi.urlPath = undefined
    this.pageIndex = 1
    this.domainResult = []
    this.domains = []
    this.loadDomainApiData(true)
  }

  onDomainSelect(item: NameValue | string) {
    if (typeof item === 'string') {
      this.domain = item
      this.domainChange()
    } else {
      this.domain = item.name
      this.domainChange()
    }
  }

  onDomainDateSelect(item: NameValue) {
    if (item.name !== this.queryDomain.date) {
      this.queryDomain.date = item.name
      this.dateChange()
    }
  }

  viewItem(item: RestApiOnlineLog) {
    window.open(`http://${item.domain}${item.urlPath}`)
  }

  searchDomain(prefix: string) {
    if (prefix) {
      this.queryDomainSubject.next({ namePrefix: prefix, date: this.queryDomain.date, termsField: 'name', size: 10 })
    }
  }

  loadDomainApiData(hasDomain = false) {
    if (this.queryApi.domain && this.queryApi.date) {
      this.queryApiSubject.next({
        query: { ...this.queryApi, ...this.toPageQuery() },
        hasDomain: this.domainResult.length === 0 || hasDomain
      })
    }
  }

  pageChange() {
    this.loadDomainApiData()
  }

  loadData() {
    this.onlineService.queryDomain({ ...this.queryDomain }).subscribe(res => {
      if (res.data.dates && res.data.dates.length > 0) {
        this.dates = res.data.dates
        this.queryDomain.date = this.dates[0].id
        this.queryApi.date = this.queryDomain.date
      }
      if (res.data.domains) {
        this.domains = res.data.domains.list
        this.domainsResult = res.data.domains.list.map(item => {
          return { name: item.name, value: item.count }
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
    return item.count.toLocaleString()
  }

  ngOnInit(): void {
    this.loadData()
  }
}
