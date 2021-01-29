import { Component, Input, OnInit } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { UiDriverInfo } from 'app/api/service/ui.service'

@Component({
  selector: 'app-ui-device-info-preview',
  templateUrl: './ui-device-info-preview.component.html',
  styleUrls: ['./ui-device-info-preview.component.css']
})
export class UiDeviceInfoPreviewComponent implements OnInit {

  @Input() info: UiDriverInfo = {}

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  getImgSrc() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.info.screenCapture}`)
  }

  getUpdateTime() {
    if (this.info.timestamp) {
      return new Date(this.info.timestamp).toLocaleString()
    }
  }

  ngOnInit(): void {

  }

}
