import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { JobService } from '../../../api/service/job.service'
import { Job } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
})
export class JobsComponent extends PageSingleModel implements OnInit {

  loading = false
  items: Job[] = []

  constructor(
    private jobService: JobService,
    private msg: NzMessageService,
    private router: Router,
  ) {
    super()
  }

  goGroup(item: Job) {
    this.router.navigateByUrl(`/${item.group}`)
  }

  goProject(item: Job) {
    this.router.navigateByUrl(`/${item.group}/${item.project}`)
  }

  goItem(item: Job) {
    this.router.navigateByUrl(`/${item.group}/${item._id}`)
  }

  goSettings(item: Job) {
    this.router.navigateByUrl(`/job/${item.group}/${item.project}/${item._id}`)
  }

  loadData() {
    this.loading = true
    this.jobService.query(this.toPageQuery()).subscribe(res => {
      this.items = res.data.list
      this.pageTotal = res.data.total
      this.loading = false
    }, err => this.loading = false)
  }

  pageChange() {
    this.loadData()
  }

  ngOnInit() {
    this.loadData()
  }
}
