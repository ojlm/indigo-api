import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { GroupService } from 'app/api/service/group.service'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

@Component({
  selector: 'app-group-options',
  templateUrl: './group-options.component.html',
})
export class GroupOptionsComponent implements OnInit {

  group = ''

  constructor(
    private groupService: GroupService,
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
        this.groupService.delete(this.group).subscribe(res => {
          this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
          this.router.navigateByUrl(`/`)
        })
      },
      nzCancelText: this.i18nService.fanyi(I18nKey.BtnCancel)
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.group = param.get('group')
    })
  }
}
