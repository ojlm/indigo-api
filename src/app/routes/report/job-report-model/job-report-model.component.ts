import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { I18NService } from '@core/i18n/i18n.service'
import { NzMessageService } from 'ng-zorro-antd'

import { CaseService } from '../../../api/service/case.service'
import { JobService } from '../../../api/service/job.service'
import { ScenarioService } from '../../../api/service/scenario.service'
import { JobReport } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-job-report-model',
  templateUrl: './job-report-model.component.html',
})
export class JobReportModelComponent extends PageSingleModel implements OnInit {

  group: string
  project: string
  reportId: string
  report: JobReport

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private scenarioService: ScenarioService,
    private jobService: JobService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private i18nService: I18NService,
  ) {
    super()
  }

  loadDataById() {
    if (this.reportId) {
      this.jobService.getReportById(this.reportId).subscribe(res => {
        this.report = res.data
      })
    }
  }

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
    })
    this.route.parent.params.subscribe(params => {
      const reportId = params['reportId']
      if (reportId) {
        this.reportId = reportId
        this.loadDataById()
      }
    })
  }
}
