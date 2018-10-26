import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

import { ProjectService } from '../../../api/service/project.service'

@Component({
  selector: 'app-project-options',
  templateUrl: './project-options.component.html',
})
export class ProjectOptionsComponent implements OnInit {

  group = ''
  project = ''

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

  delete() {
    this.modalService.confirm({
      nzTitle: `<i>${this.i18nService.fanyi(I18nKey.TipsConfirmDelete)}</i>`,
      nzContent: `<b>${this.i18nService.fanyi(I18nKey.TipsConfirmDeleteContent)}</b>`,
      nzOkText: this.i18nService.fanyi(I18nKey.BtnOk),
      nzOnOk: () => {
        this.projectService.delete(this.group, this.project).subscribe(res => {
          this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
          this.router.navigateByUrl(`/${this.group}`)
        })
      },
      nzCancelText: this.i18nService.fanyi(I18nKey.BtnCancel)
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.group = param.get('group')
      this.project = param.get('project')
    })
  }
}
