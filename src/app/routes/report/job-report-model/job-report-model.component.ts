import { Location } from '@angular/common'
import { Component, HostListener, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd'

import { CaseService } from '../../../api/service/case.service'
import { JobService } from '../../../api/service/job.service'
import { ScenarioService } from '../../../api/service/scenario.service'
import { CaseReportItem, JobReport, JobReportDataStatistic, ScenarioReportItem } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'
import { calcDrawerWidth } from '../../../util/drawer'
import { JobReportItemComponent } from '../job-report-item/job-report-item.component'

@Component({
  selector: 'app-job-report-model',
  templateUrl: './job-report-model.component.html',
  styles: [`
    .span-label {
      color: darkgray;
    }
    .clickable {
      cursor:pointer;
    }
    .clickable:hover {
      transform: scale(1.1);
      color: darkorange;
    }
  `]
})
export class JobReportModelComponent extends PageSingleModel implements OnInit {

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private scenarioService: ScenarioService,
    private drawerService: NzDrawerService,
    private jobService: JobService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private i18nService: I18NService,
  ) {
    super()
  }

  group: string
  project: string
  reportId: string
  report: JobReport = {}
  statis: JobReportDataStatistic = {}
  pageSize = 10
  casePageIndex = 1
  caseItems: CaseReportItem[] = []
  scenarioPageIndex = 1
  scenarioItems: ScenarioReportItem[] = []
  dayIndexSuffix = ''
  // chart view
  view = [(window.innerWidth - 100) / 2, 360]
  fullView = [window.innerWidth - 100, 360]
  // card
  cardData: NameValue[] = []
  // pie data
  assertions: NameValue[] = []
  colorScheme = {
    domain: ['deepskyblue', 'darksalmon', '#C7B42C', '#AAAAAA']
  }
  coolColorScheme = {
    domain: [
      '#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963', '#8796c0', '#7ed3ed', '#50abcc', '#ad6886'
    ]
  }
  cardColorScheme = {
    domain: [
      'lightgray', 'deepskyblue', 'darksalmon', 'lightgray', 'deepskyblue',
      'darksalmon', 'lightgray', 'deepskyblue', 'darksalmon', 'lightpink'
    ]
  }
  okRates = []
  statisSeries = []
  @HostListener('window:resize')
  resize() {
    this.view = [(window.innerWidth - 100) / 2, 360]
    this.fullView = [window.innerWidth - 100, 360]
  }

  viewItem(item: CaseReportItem) {
    if ('skipped' !== item.status) {
      this.drawerService.create<JobReportItemComponent, { day: string, data: CaseReportItem }, any>({
        nzTitle: item.title,
        nzWidth: calcDrawerWidth(),
        nzContent: JobReportItemComponent,
        nzContentParams: {
          day: this.dayIndexSuffix,
          data: item
        }
      })
    }
  }

  tagColor(status: string) {
    switch (status) {
      case 'pass':
        return 'cyan'
      case 'fail':
        return 'magenta'
      default:
        return ''
    }
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
        this.scenarioItems = this.report.data.scenarios.map(item => {
          return { ...item, expand: true }
        })
        this.jobService.reportTrend(this.report.jobId).subscribe(trendRes => {
          const reports = trendRes.data.list
          if (null != reports && reports.length > 0) {
            const okRateSeries: SeriesItem = { name: this.i18nService.fanyi(I18nKey.FieldOkRate), series: [] }
            const assertionPassedSeries: SeriesItem = { name: this.i18nService.fanyi(I18nKey.ItemPassAssertion), series: [] }
            const assertionFailedSeries: SeriesItem = { name: this.i18nService.fanyi(I18nKey.ItemFailAssertion), series: [] }
            const caseCountSeries: SeriesItem = { name: this.i18nService.fanyi(I18nKey.ItemCaseCount), series: [] }
            const caseOKSeries: SeriesItem = { name: this.i18nService.fanyi(I18nKey.ItemCaseOK), series: [] }
            const caseKOSeries: SeriesItem = { name: this.i18nService.fanyi(I18nKey.ItemCaseKO), series: [] }
            const scenarioCountSeries: SeriesItem = { name: this.i18nService.fanyi(I18nKey.ItemScenarioCount), series: [] }
            const scenarioOKSeries: SeriesItem = { name: this.i18nService.fanyi(I18nKey.ItemScenarioOk), series: [] }
            const scenarioKOSeries: SeriesItem = { name: this.i18nService.fanyi(I18nKey.ItemScenarioKO), series: [] }
            const scenarioCaseCountSeries: SeriesItem = { name: this.i18nService.fanyi(I18nKey.ItemScenarioCaseCount), series: [] }
            const scenarioCaseOKSeries: SeriesItem = { name: this.i18nService.fanyi(I18nKey.ItemScenarioCaseOk), series: [] }
            const scenarioCaseKOSeries: SeriesItem = { name: this.i18nService.fanyi(I18nKey.ItemScenarioCaseKO), series: [] }
            const scenarioCaseOOSeries: SeriesItem = { name: this.i18nService.fanyi(I18nKey.ItemScenarioCaseOO), series: [] }
            reports.forEach(report => {
              okRateSeries.series.push({ name: report.endAt, value: report.statis.okRate })
              assertionPassedSeries.series.push({ name: report.endAt, value: report.statis.assertionPassed })
              assertionFailedSeries.series.push({ name: report.endAt, value: report.statis.assertionFailed })
              caseCountSeries.series.push({ name: report.endAt, value: report.statis.caseCount })
              caseOKSeries.series.push({ name: report.endAt, value: report.statis.caseOK })
              caseKOSeries.series.push({ name: report.endAt, value: report.statis.caseKO })
              scenarioCountSeries.series.push({ name: report.endAt, value: report.statis.scenarioCount })
              scenarioOKSeries.series.push({ name: report.endAt, value: report.statis.scenarioOK })
              scenarioKOSeries.series.push({ name: report.endAt, value: report.statis.scenarioKO })
              scenarioCaseCountSeries.series.push({ name: report.endAt, value: report.statis.scenarioCaseCount })
              scenarioCaseOKSeries.series.push({ name: report.endAt, value: report.statis.scenarioCaseOK })
              scenarioCaseKOSeries.series.push({ name: report.endAt, value: report.statis.scenarioCaseKO })
              scenarioCaseOOSeries.series.push({ name: report.endAt, value: report.statis.scenarioCaseOO })
            })
            this.okRates = [okRateSeries]
            this.statisSeries = [
              assertionPassedSeries, assertionFailedSeries, caseCountSeries, caseOKSeries,
              caseKOSeries, scenarioCountSeries, scenarioOKSeries, scenarioKOSeries,
              scenarioCaseCountSeries, scenarioCaseOKSeries, scenarioCaseKOSeries, scenarioCaseOOSeries
            ]
          }
        })
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

export interface SeriesItem {
  name?: string
  series?: NameValue[]
}
