import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { UiService } from 'app/api/service/ui.service'

import { APP, ReportResultItem, UiTaskReport } from '../ui.model'

@Component({
  selector: 'app-ui-task-report-servos',
  templateUrl: './ui-task-report-servos.component.html',
  styleUrls: ['./ui-task-report-servos.component.css']
})
export class UiTaskReportServosComponent implements OnInit {

  servos: ReportResultItem[] = []

  @Input() set report(report: UiTaskReport) {
    if (report && report.data && report.data.result) {
      switch (report.type) {
        case APP.WEB_MONKEY:
          const tmp: ReportResultItem[] = []
          for (const k in report.data.result) {
            tmp.push({ _k: k, ...report.data.result[k] })
          }
          this.servos = tmp
          break
      }
    }
  }

  constructor(
    private uiService: UiService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

}
