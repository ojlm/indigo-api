import { formatDate } from '@angular/common'
import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { AggsResult, UiService } from 'app/api/service/ui.service'

import { UiTaskReport } from '../ui.model'

@Component({
  selector: 'app-ui-task-report',
  templateUrl: './ui-task-report.component.html',
  styleUrls: ['./ui-task-report.component.css']
})
export class UiTaskReportComponent implements OnInit {

  logsHeight = window.innerHeight - 92
  group = ''
  project = ''
  id = ''
  aggs: AggsResult = {}
  report: UiTaskReport = {}

  @HostListener('window:resize')
  resize() {
    this.logsHeight = window.innerHeight - 84
  }

  constructor(
    private uiService: UiService,
    private route: ActivatedRoute,
  ) { }

  getImgSrc() {
    if (this.report.type) {
      return `/assets/svg/${this.report.type}.svg`
    } else {
      return '/assets/svg/file.svg'
    }
  }

  timeStr(time: number) {
    return formatDate(time, 'yyyy-MM-dd hh:mm:ss', 'zh-cn')
  }

  loadReport() {
    if (this.group && this.project && this.id) {
      this.uiService.getTaskReport(this.group, this.project, this.id).subscribe(res => {
        this.report = res.data
        this.uiService.getAggs(this.group, this.project, this.id, this.report.day).subscribe(aggsRes => {
          this.aggs = aggsRes.data
        })
      })
    }
  }

  ngOnInit(): void {
    const params = this.route.snapshot.params
    this.group = params['group']
    this.project = params['project']
    this.id = params['reportId']
    this.loadReport()
  }

}
