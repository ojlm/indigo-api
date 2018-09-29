import { Location } from '@angular/common'
import { Component, HostListener, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { NzMessageService } from 'ng-zorro-antd'

import { CaseService } from '../../../api/service/case.service'
import { JobService } from '../../../api/service/job.service'
import { ScenarioService } from '../../../api/service/scenario.service'
import { CaseReportItem, JobReport, JobReportDataStatistic, ScenarioReportItem } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-job-report-model',
  templateUrl: './job-report-model.component.html',
  styles: [`
    .span-label {
      color: darkgray;
    }
  `]
})
export class JobReportModelComponent extends PageSingleModel implements OnInit {

  group: string
  project: string
  reportId: string
  report: JobReport = {}
  statis: JobReportDataStatistic = {}
  caseItems: CaseReportItem[] = []
  scenarioItems: ScenarioReportItem[] = []
  dayIndexSuffix = ''
  // chart view
  view = [(window.innerWidth - 100) / 2, 360]
  // card
  cardData: NameValue[] = []
  // pie data
  assertions: NameValue[] = []
  colorScheme = {
    domain: ['deepskyblue', 'darksalmon', '#C7B42C', '#AAAAAA']
  }
  cardColorScheme = {
    domain: [
      'lightgray', 'deepskyblue', 'darksalmon', 'lightgray', 'deepskyblue',
      'darksalmon', 'deepskyblue', 'darksalmon', 'lightgray', 'lightpink'
    ]
  }
  @HostListener('window:resize')
  resize() {
    this.view = [(window.innerWidth - 100) / 2, 360]
  }

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
        this.statis = this.report.statis
        this.assertions = [
          { name: this.i18nService.fanyi(I18nKey.ItemPassAssertion), value: this.statis.assertionPassed },
          { name: this.i18nService.fanyi(I18nKey.ItemFailAssertion), value: this.statis.assertionFailed }
        ]
        this.cardData = [
          { name: this.i18nService.fanyi(I18nKey.ItemCaseCount), value: this.statis.caseCount },
          { name: this.i18nService.fanyi(I18nKey.ItemCaseOK), value: this.statis.caseOK },
          { name: this.i18nService.fanyi(I18nKey.ItemCaseKO), value: this.statis.caseKO },
          { name: this.i18nService.fanyi(I18nKey.ItemScenarioCount), value: this.statis.scenarioCount },
          { name: this.i18nService.fanyi(I18nKey.ItemScenarioOk), value: this.statis.scenarioOK },
          { name: this.i18nService.fanyi(I18nKey.ItemScenarioKO), value: this.statis.scenarioKO },
          { name: this.i18nService.fanyi(I18nKey.ItemScenarioCaseCount), value: this.statis.scenarioCaseCount },
          { name: this.i18nService.fanyi(I18nKey.ItemScenarioCaseOk), value: this.statis.scenarioCaseOK },
          { name: this.i18nService.fanyi(I18nKey.ItemScenarioCaseKO), value: this.statis.scenarioCaseKO },
          { name: this.i18nService.fanyi(I18nKey.ItemScenarioCaseOO), value: this.statis.scenarioCaseOO },
        ]
        this.dayIndexSuffix = this.report.data.dayIndexSuffix
        this.caseItems = this.report.data.cases
        this.scenarioItems = this.report.data.scenarios
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

export interface NameValue {
  name?: string
  value?: number
}
