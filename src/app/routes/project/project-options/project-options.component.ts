import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { GroupProjectSelectorModel } from '@shared/group-project-selector/group-project-selector.component'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

import { ProjectService, TransferProject } from '../../../api/service/project.service'

@Component({
  selector: 'app-project-options',
  templateUrl: './project-options.component.html',
  styles: [`
    .divider-text {
      font-size: small;
      color: gray;
    }
  `]
})
export class ProjectOptionsComponent implements OnInit {

  group = ''
  project = ''
  loading = false
  transferGroupProject: GroupProjectSelectorModel = {}

  constructor(
    private projectService: ProjectService,
    private msgService: NzMessageService,
    private router: Router,
    private i18nService: I18NService,
    private modalService: NzModalService,
    private route: ActivatedRoute,
    private location: Location,
  ) {
  }

  transfer() {
    const op: TransferProject = {
      oldGroup: this.group,
      oldId: this.project,
      newGroup: this.transferGroupProject.group,
      newId: this.transferGroupProject.project,
    }
    this.modalService.confirm({
      nzTitle: `TO: ${op.newGroup}/${op.newId}<i>${this.i18nService.fanyi(I18nKey.BtnOk)}?</i>`,
      nzOkText: this.i18nService.fanyi(I18nKey.BtnOk),
      nzOnOk: () => {
        this.loading = true
        this.projectService.transfer(op).subscribe(res => {
          this.loading = false
          this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
          this.router.navigateByUrl(`/${op.newGroup}/${op.newId}`)
        }, err => this.loading = false)
      },
      nzCancelText: this.i18nService.fanyi(I18nKey.BtnCancel)
    })
  }

  delete() {
    this.modalService.confirm({
      nzTitle: `<i>${this.i18nService.fanyi(I18nKey.TipsConfirmDelete)}</i>`,
      nzContent: `<b>${this.i18nService.fanyi(I18nKey.TipsConfirmDeleteContent)}</b>`,
      nzOkText: this.i18nService.fanyi(I18nKey.BtnOk),
      nzOnOk: () => {
        this.loading = true
        this.projectService.delete(this.group, this.project).subscribe(res => {
          this.loading = false
          this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
          this.router.navigateByUrl(`/${this.group}`)
        }, err => this.loading = false)
      },
      nzCancelText: this.i18nService.fanyi(I18nKey.BtnCancel)
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.group = param.get('group')
      this.transferGroupProject.group = this.group
      this.project = param.get('project')
    })
  }
}
