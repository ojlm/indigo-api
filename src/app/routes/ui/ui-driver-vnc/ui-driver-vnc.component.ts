import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core'
import RFB from '@novnc/novnc/core/rfb.js'
import { UiDriverInfo, UiService } from 'app/api/service/ui.service'

@Component({
  selector: 'app-ui-driver-vnc',
  templateUrl: './ui-driver-vnc.component.html',
})
export class UiDriverVncComponent implements AfterViewInit, OnDestroy {

  rfb: RFB

  @ViewChild('vnc') vncELe: ElementRef
  @Input() group = ''
  @Input() project = ''
  @Input() height = 360
  @Input()
  set driver(val: UiDriverInfo) {
    console.log('val:', val, this.vncELe)
  }

  constructor(
    private uiService: UiService,
  ) { }

  refreshRfb(driver: UiDriverInfo) {
    const url = this.uiService.getRfbProxyUrl(driver, this.group, this.project)
    // https://github.com/novnc/noVNC/blob/master/docs/API.md
    if (this.rfb) {
      this.rfb.disconnect()
    }
    this.rfb = new RFB(document.getElementById('vnc'), url, {
      credentials: { password: driver.password },
    })
    this.rfb.scaleViewport = true
    this.rfb.background = 'transparent'
    this.rfb.addEventListener('connect', () => {
    })
    this.rfb.addEventListener('disconnect', () => {
    })
    this.rfb.addEventListener('credentialsrequired', () => {
    })
    this.rfb.addEventListener('desktopname', (e: any) => {
    })
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    if (this.rfb) {
      this.rfb.disconnect()
    }
  }

}
