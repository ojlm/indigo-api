import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { JobService } from '../../../api/service/job.service'
import { Job } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-group-jobs',
  templateUrl: './group-jobs.component.html',
})
export class GroupJobsComponent extends PageSingleModel implements OnInit {

  groupId: string
  loading = false
  items: Job[] = []

  constructor(
    private jobService: JobService,
    private msg: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
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
    this.jobService.query({ ...this.toPageQuery(), group: this.groupId }).subscribe(res => {
      this.items = res.data.list
      this.pageTotal = res.data.total
      this.loading = false
    }, err => this.loading = false)
  }

  pageChange() {
    this.loadData()
  }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this.groupId = param.get('group')
      this.loadData()
    })
  }
}
