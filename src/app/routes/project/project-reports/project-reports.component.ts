import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { JobService } from '../../../api/service/job.service'
import { JobReport } from '../../../model/es.model'
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
  search = { text: undefined, type: undefined }
  types = ['quartz', 'ci', 'manual', 'test']

  constructor(
    private jobService: JobService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { super() }

  loadData() {
    if (this.group && this.project) {
      this.loading = true
      this.jobService.queryReports({ group: this.group, project: this.project, ...this.search, ...this.toPageQuery() }).subscribe(res => {
        this.items = res.data.list
        this.pageTotal = res.data.total
        this.loading = false
      }, err => this.loading = false)
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
    this.route.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.loadData()
    })
  }
}
