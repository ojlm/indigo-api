import { Component, HostListener, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AggsItem } from 'app/api/service/base.service'
import { CaseService } from 'app/api/service/case.service'
import { SystemService } from 'app/api/service/system.service'

import { NameValue } from '../report/job-report-model/job-report-model.component'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  size = 20
  level = 'group'
  treeMapHeight = `${Math.floor((window.innerHeight - 150) * 0.6)}px`
  barHeight = `${Math.floor((window.innerHeight - 150) * 0.4)}px`
  title = ['🌇', '🌆', '🏙', '🌃', '🌉', '🌌', '🌠', '🎆', '🌈', '🌅', '🎑', '🏞']
  results: NameValue[] = [{ name: 'indigo', value: 0 }]
  indices: NameValue[] = [{ name: 'indigo', value: 0 }]
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
    this.treeMapHeight = `${Math.floor((window.innerHeight - 150) * 0.6)}px`
    this.barHeight = `${Math.floor((window.innerHeight - 150) * 0.4)}px`
  }
  constructor(
    private caseService: CaseService,
    private systemService: SystemService,
    private router: Router,
  ) {
    this.loadGroupData()
    this.systemService.getJobReportDataIndices().subscribe(res => {
      const items = res.data
      if (items && items.length > 0) {
        const indices: NameValue[] = []
        for (let i = items.length - 1; i >= 0; i--) {
          const item = items[i]
          const a = item.index.split('-')
          indices.push({ name: a[a.length - 1].substr(5, 5), value: parseInt(item['docs.count'], 10) })
        }
        this.indices = indices
      }
    })
  }

  loadGroupData() {
    this.level = 'group'
    this.group = ''
    this.caseService.aggs({ size: this.size }).subscribe(res => {
      const map = {}
      this.results = res.data.map(item => {
        map[item.id] = item
        return { name: item.id, value: item.count }
      })
      this.groupMap = map
    })
  }

  loadGroupProjectData(group: string) {
    this.caseService.aggs({ size: this.size, group: group }).subscribe(res => {
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
      const group = this.groupMap[item.name]
      this.level = 'project'
      this.group = group.id
      this.loadGroupProjectData(group.id)
    } else if ('project' === this.level) {
      const project = this.projectMap[item.name]
      this.router.navigateByUrl(`/${this.group}/${project.id}`)
    }
  }

  shuffle() {
    for (let i = this.title.length; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const t = this.title[i]
      this.title[i] = this.title[j]
      this.title[j] = t
    }
  }

  ngOnInit() {
    this.shuffle()
  }
}
