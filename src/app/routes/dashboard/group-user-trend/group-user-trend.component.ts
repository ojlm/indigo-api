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

  type = 'case-growth'
  fitView: any[] = [window.innerWidth, Math.floor(window.innerHeight - 150)]
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
  caseAggreations: NameValue[] = [{ name: 'indigo', series: [{ name: 'indigo', value: 0 }] }]
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
    private caseService: CaseService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  typeChange() {
    if (this.type === 'case-aggregation') {
      this.updateCaseAggregationData()
    } else if (this.type === 'activity-aggregation') {
    }
  }

  updateCaseAggregationData() {
    if (this.data && this.data.length > 0) {
      if (this.data[0].sub[0].type === 'group') {
        const tmp: { [k: string]: NameValue[] } = {}
        this.data.forEach(item => {
          const date = item.id
          const subGroupCount: { [k: string]: number } = {}
          item.sub.forEach(subItem => {
            subGroupCount[subItem.id] = subItem.count
          })
          this.groups.forEach(group => {
            const groupSeries = tmp[group.id] || []
            let subCount = 0
            if (subGroupCount[group.id] !== undefined) {
              subCount = subGroupCount[group.id]
            }
            if (groupSeries.length > 0) {
              groupSeries.push({ name: date, value: subCount + groupSeries[groupSeries.length - 1].value })
            } else {
              groupSeries.push({ name: date, value: subCount })
            }
            tmp[group.id] = groupSeries
          })
        })
        const tmpResults: NameValue[] = []
        this.groups.forEach(group => {
          tmpResults.push({ name: group.id, series: tmp[group.id] })
        })
        if (tmpResults.length > 0) {
          this.caseAggreations = tmpResults
        }
      } else {
        // TODO
      }
    }
  }

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
