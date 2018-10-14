import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

import { JobOperation, JobService, QueryJob } from '../../../api/service/job.service'
import { Job } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-project-jobs',
  templateUrl: './project-jobs.component.html',
})
export class ProjectJobsComponent extends PageSingleModel implements OnInit {

  items: Job[] = []
  loading = false
  group: string
  project: string
  search: QueryJob = {}
  types = ['cron', 'simple', 'manual']

  constructor(
    private jobService: JobService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private modal: NzModalService,
  ) { super() }

  loadData() {
    if (this.group && this.project) {
      this.loading = true
      this.jobService.query({ group: this.group, project: this.project, ...this.toPageQuery(), ...this.search }).subscribe(res => {
        this.items = res.data.list
        this.pageTotal = res.data.total
        this.loading = false
      }, err => this.loading = false)
    }
  }

  getRouter(item: Job) {
    return `/job/${this.group}/${this.project}/${item._id}`
  }

  resumeItem(item: Job) {
    this.jobService.resume(this.toJobOp(item)).subscribe(res => {
      this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
    })
  }

  pauseItem(item: Job) {
    this.jobService.pause(this.toJobOp(item)).subscribe(res => {
      this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
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
