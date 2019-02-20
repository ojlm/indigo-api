import { formatDate, Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ApiRes } from 'app/model/api.model'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { JobService, QueryJob, QueryJobReport } from '../../../api/service/job.service'
import { Job, JobReport } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-project-reports',
  templateUrl: './project-reports.component.html',
})
export class ProjectReportsComponent extends PageSingleModel implements OnInit {

  items: JobReport[] = []
  loading = false
  group: string
  project: string
  search: QueryJobReport = { text: undefined, type: undefined, result: undefined }
  types = ['quartz', 'ci', 'manual', 'test']
  results = ['success', 'fail']
  dates: Date[] = []
  jobs: Job[] = []
  queryJobSubject: Subject<QueryJob>

  constructor(
    private jobService: JobService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { super() }

  doSearch() {
    this.pageIndex = 1
    this.loadData()
  }

  loadData() {
    if (this.group && this.project) {
      if (this.dates.length === 2) {
        const locale = (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language
        this.search.timeStart = formatDate(this.dates[0], 'yyyy-MM-dd HH:mm:ss', locale)
        this.search.timeEnd = formatDate(this.dates[1], 'yyyy-MM-dd HH:mm:ss', locale)
      } else {
        this.search.timeStart = undefined
        this.search.timeEnd = undefined
      }
      this.loading = true
      this.jobService.queryReports({ group: this.group, project: this.project, ...this.search, ...this.toPageQuery() }).subscribe(res => {
        this.items = res.data.list
        this.pageTotal = res.data.total
        this.loading = false
      }, err => this.loading = false)
    }
  }

  searchJob(txt: string) {
    if (this.group && this.project) {
      this.queryJobSubject.next({ group: this.group, project: this.project, text: txt, size: 10 })
    }
  }

  getRouter(item: JobReport) {
    return `/report/job/${this.group}/${this.project}/${item._id}`
  }

  viewItem(item: JobReport) {
    // this.router.navigateByUrl(this.getRouter(item))
    window.open(this.getRouter(item))
  }

  editItem(item: JobReport) {
    this.router.navigateByUrl(`/job/${this.group}/${this.project}/${item.jobId}`)
  }

  pageChange() {
    this.loadData()
  }

  resultColor(result: string) {
    switch (result) {
      case 'success':
        return 'green'
      case 'fail':
        return 'lightcoral'
      case 'warn':
        return 'orange'
      case 'aborted':
        return 'red'
      default:
        return ''
    }
  }

  tagColor(type: string) {
    switch (type) {
      case 'quartz':
        return 'cyan'
      case 'ci':
        return 'green'
      case 'manual':
        return 'lime'
      case 'test':
        return 'gold'
      default:
        return ''
    }
  }

  ngOnInit(): void {
    const responseSubject = new Subject<ApiRes<Job[]>>()
    responseSubject.subscribe(res => {
      this.jobs = res.data.list
    })
    this.queryJobSubject = this.jobService.newQuerySubject(responseSubject)
    this.route.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.loadData()
      this.searchJob('')
    })
  }
}
