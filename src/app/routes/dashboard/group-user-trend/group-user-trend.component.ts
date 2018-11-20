import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AggsCase, AggsItem, CaseService } from 'app/api/service/case.service'
import { NameValue } from 'app/model/common.model'
import { Group } from 'app/model/es.model'

@Component({
  selector: 'app-group-user-trend',
  templateUrl: './group-user-trend.component.html',
})
export class GroupUserTrendComponent implements OnInit {

  view1: any[] = [window.innerWidth, Math.floor(window.innerHeight - 150)]
  view2: any[] = undefined
  colorScheme = {
    domain: [
      '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064'
    ]
  }
  colorScheme2 = {
    domain: this.colorScheme.domain.reverse()
  }
  groups: Group[] = []
  group = ''
  aggsParams: AggsCase = {
    interval: '1M',
    termsField: 'group',
    dateRange: '1y'
  }
  data: AggsItem[] = []
  results: NameValue[] = [{ name: 'indigo', value: 0 }]
  showSubChart = false
  subResults: NameValue[] = []
  @HostListener('window:resize')
  resize() {
    if (this.showSubChart) {
      this.view1 = [window.innerWidth, Math.floor((window.innerHeight - 150) * 0.4)]
      this.view2 = [window.innerWidth, Math.floor((window.innerHeight - 150) * 0.6)]
    } else {
      this.view1 = [window.innerWidth, Math.floor(window.innerHeight - 150)]
    }
  }

  constructor(
    private caseService: CaseService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  groupChange() {
    if (this.group) {
      this.aggsParams.termsField = 'project'
    } else {
      this.aggsParams.termsField = 'group'
    }
    this.loadData()
  }

  loadData() {
    let groups: boolean = null
    if (this.groups && this.groups.length > 0) {
      groups = false
    }
    this.caseService.trend({ group: this.group, ...this.aggsParams }, groups).subscribe(res => {
      this.showSubChart = false
      this.resize()
      if (res.data.groups && res.data.groups.length > 0) {
        this.groups = res.data.groups
      }
      this.data = res.data.trends
      this.results = res.data.trends.map(item => {
        return { name: item.id, value: item.count }
      })
    })
  }

  onSelect(item: NameValue) {
    const dataAggItem = this.data.find(dataItem => dataItem.id === item.name)
    if (dataAggItem) {
      const subAggItems = dataAggItem.sub
      if (subAggItems && subAggItems.length > 0) {
        this.showSubChart = true
        this.resize()
        if (subAggItems[0].type === 'group') {
          const tmp: { [k: string]: boolean } = {}
          const tmpResults = subAggItems.map(subAggItem => {
            tmp[subAggItem.id] = true
            return { name: subAggItem.id, value: subAggItem.count }
          })
          this.groups.forEach(group => {
            if (!tmp[group.id]) {
              tmpResults.push({ name: group.id, value: 0 })
            }
          })
          this.subResults = tmpResults
        } else {
          this.subResults = subAggItems.map(subAggItem => {
            return { name: subAggItem.id, value: subAggItem.count }
          })
        }
      }
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.loadData()
    })
  }
}
