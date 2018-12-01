import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AggsItem } from 'app/api/service/base.service'
import { OnlineService, QueryDomain } from 'app/api/service/online.service'
import { NameValue } from 'app/model/common.model'
import { DomainOnlineLog } from 'app/model/es.model'

@Component({
  selector: 'app-domain-api-online',
  templateUrl: './domain-api-online.component.html',
})
export class DomainApiOnlineComponent implements OnInit {

  fitView: any[] = [window.innerWidth, Math.floor(window.innerHeight - 150)]
  view1: any[] = [window.innerWidth, Math.floor(window.innerHeight - 150)]
  view2: any[] = undefined
  colorScheme = {
    domain: [
      '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064'
    ]
  }
  domain = ''
  dates: AggsItem[] = []
  domains: DomainOnlineLog[] = []
  domainsResult: NameValue[] = [{ name: 'indigo', value: 0 }]
  queryDomain: QueryDomain = {
    size: 50,
  }
  showSubChart = false
  @HostListener('window:resize')
  resize() {
    this.fitView = [window.innerWidth, Math.floor(window.innerHeight - 150)]
    if (this.showSubChart) {
      this.view1 = [window.innerWidth, Math.floor((window.innerHeight - 150) * 0.4)]
      this.view2 = [window.innerWidth, Math.floor((window.innerHeight - 150) * 0.6)]
    } else {
      this.view1 = [window.innerWidth, Math.floor(window.innerHeight - 150)]
    }
  }

  constructor(
    private onlineService: OnlineService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  dateChange() {
    console.log('dateChange:', this.queryDomain)
  }

  domainChange() {
    this.queryDomain.names = this.domain ? [this.domain] : null
    console.log('domainChange:', this.queryDomain)
  }

  loadData() {
    this.onlineService.queryDomain({ ...this.queryDomain }).subscribe(res => {
      if (res.data.dates && res.data.dates.length > 0) {
        this.dates = res.data.dates
        this.queryDomain.date = this.dates[0].id
      }
      if (res.data.domains) {
        this.domains = res.data.domains.list
        this.domainsResult = res.data.domains.list.map(item => {
          return { name: item.name, value: item.count }
        })
      }
    })
  }

  onDomainSelect(item: NameValue | string) {
    console.log('onDomainSelect:', item)
  }

  ngOnInit(): void {
    this.loadData()
  }
}
