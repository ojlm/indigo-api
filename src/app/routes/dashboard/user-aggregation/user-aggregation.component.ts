import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { AggsItem, CaseService } from 'app/api/service/case.service'
import { NameValue } from 'app/model/common.model'

@Component({
  selector: 'app-user-aggregation',
  templateUrl: './user-aggregation.component.html',
})
export class UserAggregationComponent implements OnInit {

  username = ''
  level = 'group'
  height = `${window.innerHeight - 150}px`
  results: NameValue[] = [{ name: 'indigo', value: 0 }]
  view: any[] = undefined
  colorScheme = {
    domain: [
      '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064'
    ]
  }
  groupMap: { [k: string]: AggsItem } = {}
  group = ''
  projectMap: { [k: string]: AggsItem } = {}
  @HostListener('window:resize')
  resize() {
    this.height = `${window.innerHeight - 150}px`
  }

  constructor(
    private caseService: CaseService,
    private route: ActivatedRoute,
  ) { }

  loadGroupData() {
    this.level = 'group'
    this.group = ''
    this.caseService.aggs({ creator: this.username }).subscribe(res => {
      const map = {}
      this.results = res.data.map(item => {
        map[item.id] = item
        return { name: item.id, value: item.count }
      })
      this.groupMap = map
    })
  }

  loadGroupProjectData(group: string) {
    this.caseService.aggs({ group: group, creator: this.username }).subscribe(res => {
      const map = {}
      this.results = res.data.map(item => {
        map[item.id] = item
        return { name: item.id, value: item.count }
      })
      this.projectMap = map
    })
  }

  onSelect(item: NameValue) {
    if ('group' === this.level) {
      const aggItem = this.groupMap[item.name]
      this.level = 'project'
      this.group = aggItem.id
      this.loadGroupProjectData(aggItem.id)
    }
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username')
      this.loadGroupData()
    })
  }
}
