import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { CatIndicesResponse, SystemService } from 'app/api/service/system.service'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

@Component({
  selector: 'app-job-report-indices',
  templateUrl: './job-report-indices.component.html',
})
export class JobReportIndicesComponent implements OnInit {

  items: CatIndicesResponse[] = []
  constructor(
    private systemService: SystemService,
    private msgService: NzMessageService,
    private modalService: NzModalService,
    private i18nService: I18NService,
    private router: Router,
    private location: Location,
  ) { }

  delete(item: CatIndicesResponse) {
    this.modalService.confirm({
      nzTitle: `<i>${this.i18nService.fanyi(I18nKey.TipsConfirmDelete)}</i>`,
      nzContent: `<b>${this.i18nService.fanyi(I18nKey.TipsConfirmDeleteContent)}</b>`,
      nzOkText: this.i18nService.fanyi(I18nKey.BtnOk),
      nzOnOk: () => {
        this.systemService.deleteJobReportDataIndex(item.index).subscribe(res => {
          this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
          this.loadData()
        })
      },
      nzCancelText: this.i18nService.fanyi(I18nKey.BtnCancel)
    })
  }

  loadData() {
    this.systemService.getJobReportDataIndices().subscribe(res => {
      this.items = res.data
    })
  }

  ngOnInit(): void {
    this.loadData()
  }
}
