import { Component, HostListener } from '@angular/core'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

@Component({
  selector: 'header-storage',
  template: `
  <i nz-icon nzType="tool"></i>
  {{ 'clear-local-storage' | translate}}
  `
})
export class HeaderStorageComponent {

  constructor(
    private confirmServ: NzModalService,
    private messageServ: NzMessageService
  ) {
  }

  @HostListener('click')
  _click() {
    this.confirmServ.confirm({
      nzTitle: 'Make sure clear all local storage?',
      nzOnOk: () => {
        localStorage.clear()
        this.messageServ.success('Clear Finished!')
      }
    })
  }
}
