import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { UiService } from 'app/api/service/ui.service'

import { UiTaskReport } from '../ui.model'

@Component({
  selector: 'app-ui-task-report',
  templateUrl: './ui-task-report.component.html',
  styleUrls: ['./ui-task-report.component.css']
})
export class UiTaskReportComponent implements OnInit {

  logsHeight = window.innerHeight - 84
  group = ''
  project = ''
  id = ''

  report: UiTaskReport = {}

  @HostListener('window:resize')
  resize() {
    this.logsHeight = window.innerHeight - 84
  }

  constructor(
    private uiService: UiService,
    private route: ActivatedRoute,
  ) { }

  timeStr(time: number) {
    return new Date(time).toLocaleString()
  }

  loadReport() {
    if (this.group && this.project && this.id) {
      this.uiService.getTaskReport(this.group, this.project, this.id).subscribe(res => {
        this.report = res.data
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
