import { Component, Input, OnInit } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { UiDriverInfo, UiService } from 'app/api/service/ui.service'

import { DRIVERS, FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-activity-runner-solopi',
  templateUrl: './ui-activity-runner-solopi.component.html',
  styleUrls: ['./ui-activity-runner-solopi.component.css']
})
export class UiActivityRunnerSolopiComponent implements OnInit {

  drivers: UiDriverInfo[] = []

  group = ''
  project = ''
  _file: FileNode
  @Input()
  set file(val: FileNode) {
    this._file = val
    this.group = val.group
    this.project = val.project
    if (this.drivers.length <= 0) {
      this.loadDrivers()
    }
  }

  constructor(
    private uiService: UiService,
    private sanitizer: DomSanitizer,
  ) { }

  run() {
    const drivers = this.drivers.filter(item => item._checked)
    console.log(drivers)
  }

  getImgSrc(item: UiDriverInfo) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${item.screenCapture}`)
  }

  loadDrivers() {
    this.uiService.getDriverList(this.group, this.project, DRIVERS.ANDROID).subscribe(res => {
      this.drivers = res.data
    })
  }

  ngOnInit(): void {

  }

}
