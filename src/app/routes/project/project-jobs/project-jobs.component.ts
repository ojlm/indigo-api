import { Location } from '@angular/common'
import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { SeriesItem } from 'app/routes/report/job-report-model/job-report-model.component'
import { calcDrawerWidth } from 'app/util/drawer'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

import { JobOperation, JobService, QueryJob, QueryJobStateItem } from '../../../api/service/job.service'
import { Job } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-project-jobs',
  templateUrl: './project-jobs.component.html',
})
export class ProjectJobsComponent extends PageSingleModel implements OnInit {

  items: JobExt[] = []
  loading = false
  group: string
  project: string
  search: QueryJob = {}
  types = ['cron', 'simple', 'manual']
  chartVisible = false
  drawerWidth = calcDrawerWidth()
  okRates = []
  statisSeries = []
  coolColorScheme = {
    domain: [
      '#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963', '#8796c0', '#7ed3ed', '#50abcc', '#ad6886'
    ]
  }
  fullView = [this.drawerWidth - 40, 360]
  @HostListener('window:resize')
  resize() {
    this.drawerWidth = calcDrawerWidth()
    this.fullView = [this.drawerWidth - 40, 360]
  }

  constructor(
    private jobService: JobService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private modal: NzModalService,
  ) { super() }

  showTrend(item: Job) {
    this.chartVisible = true
    this.jobService.reportTrend(item._id).subscribe(trendRes => {
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
  }

  loadData() {
    if (this.group && this.project) {
      this.loading = true
      this.jobService.query({ group: this.group, project: this.project, ...this.toPageQuery(), ...this.search }).subscribe(res => {
        this.items = res.data.list
        this.pageTotal = res.data.total
        this.loading = false
        this.refreshJobState()
      }, err => this.loading = false)
    }
  }

  refreshJobState() {
    if (this.items.length > 0) {
      const jobStateQueryItems: QueryJobStateItem[] = []
      const idMap = {}
      this.items.forEach(item => {
        idMap[item._id] = item
        if (item.trigger && item.trigger.length > 0) {
          const triggerType = item.trigger[0].triggerType
          if ('simple' === triggerType || 'cron' === triggerType) {
            jobStateQueryItems.push({ group: item.group, project: item.project, jobId: item._id })
          } else {
            item.state = this.translateJobState('NORMAL')
          }
        }
      })
      this.jobService.getJobState(jobStateQueryItems).subscribe(stateRes => {
        if (stateRes.data) {
          for (const k of Object.keys(stateRes.data)) {
            idMap[k].state = this.translateJobState(stateRes.data[k])
          }
        }
      })
    }
  }

  translateJobState(state: string) {
    switch (state) {
      case 'NONE':
        return this.i18nService.fanyi(I18nKey.ItemNone)
      case 'NORMAL':
        return this.i18nService.fanyi(I18nKey.ItemNormal)
      case 'PAUSED':
        return this.i18nService.fanyi(I18nKey.ItemPaused)
      case 'COMPLETE':
        return this.i18nService.fanyi(I18nKey.ItemComplete)
      case 'ERROR':
        return this.i18nService.fanyi(I18nKey.ItemError)
      case 'BLOCKED':
        return this.i18nService.fanyi(I18nKey.ItemBlocked)
      default:
        return this.i18nService.fanyi(I18nKey.ItemNone)
    }
  }

  getRouter(item: Job) {
    return `/job/${this.group}/${this.project}/${item._id}`
  }

  resumeItem(item: Job) {
    this.jobService.resume(this.toJobOp(item)).subscribe(res => {
      this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      this.refreshJobState()
    })
  }

  pauseItem(item: Job) {
    this.jobService.pause(this.toJobOp(item)).subscribe(res => {
      this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      this.refreshJobState()
    })
  }

  deleteItem(item: Job) {
    this.modal.confirm({
      nzTitle: this.i18nService.fanyi(I18nKey.TipsConfirmDelete),
      nzOkText: this.i18nService.fanyi(I18nKey.BtnOk),
      nzCancelText: this.i18nService.fanyi(I18nKey.BtnCancel),
      nzOnOk: () => {
        this.jobService.delete(this.toJobOp(item)).subscribe(res => {
          this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
          this.loadData()
        })
      }
    })
  }

  editItem(item: Job) {
    this.router.navigateByUrl(this.getRouter(item))
  }

  pageChange() {
    this.loadData()
  }

  canResumeOrPause(item: Job) {
    if (item.trigger && item.trigger.length > 0) {
      const triggerType = item.trigger[0].triggerType
      return 'simple' === triggerType || 'cron' === triggerType
    } else {
      return false
    }
  }

  triggerType(item: Job) {
    if (item.trigger && item.trigger.length > 0) {
      return item.trigger[0].triggerType
    } else {
      return ''
    }
  }

  toJobOp(item: Job) {
    const op: JobOperation = {
      group: item.group,
      project: item.project,
      id: item._id
    }
    return op
  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.loadData()
    })
  }
}

export interface JobExt extends Job {
  state?: string
}
