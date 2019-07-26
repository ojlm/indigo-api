import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18NService } from '@core'
import { I18nKey } from '@core/i18n/i18n.message'
import { TriggerService } from 'app/api/service/trigger.service'
import { CiTrigger } from 'app/model/es.model'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-project-cicd-list',
  templateUrl: './project-cicd-list.component.html',
})
export class ProjectCiCdListComponent extends PageSingleModel implements OnInit {

  tips = ''
  items: CiTrigger[] = []
  loading = false
  group: string
  project: string

  constructor(
    private triggerService: TriggerService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private modal: NzModalService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super()
    this.tips = this.i18nService.fanyi(I18nKey.TipsMaxTrigger)
  }

  getRouter(item: CiTrigger) {
    return `/ci/${this.group}/${this.project}/${item._id}`
  }

  getSignature(item: CiTrigger) {
    return `${item.summary}`
  }

  editItem(item: CiTrigger) {
    this.router.navigateByUrl(this.getRouter(item))
  }

  deleteItem(item: CiTrigger) {
    this.modal.confirm({
      nzTitle: this.i18nService.fanyi(I18nKey.TipsConfirmDelete),
      nzOkText: this.i18nService.fanyi(I18nKey.BtnOk),
      nzCancelText: this.i18nService.fanyi(I18nKey.BtnCancel),
      nzOnOk: () => {
        this.triggerService.delete(item._id).subscribe(res => {
          this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
          this.loadData()
        })
      }
    })
  }

  loadData() {
    if (this.group && this.project) {
      this.loading = true
      this.triggerService.query({ group: this.group, project: this.project, ...this.toPageQuery() }).subscribe(res => {
        this.loading = false
        this.items = res.data.list
        this.pageTotal = res.data.total
      }, err => this.loading = false)
    }
  }

  pageChange() {
    this.loadData()
  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.loadData()
    })
  }
}
