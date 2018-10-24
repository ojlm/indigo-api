import { Component, HostListener, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AggsItem, CaseService } from 'app/api/service/case.service'

import { NameValue } from '../report/job-report-model/job-report-model.component'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  size = 20
  level = 'group'
  height = `${window.innerHeight - 150}px`
  title = ['🌇', '🌆', '🏙', '🌃', '🌉', '🌌', '🌠', '🎆', '🌈', '🌅', '🎑', '🏞']
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
    private router: Router,
  ) {
    this.loadGroupData()
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
