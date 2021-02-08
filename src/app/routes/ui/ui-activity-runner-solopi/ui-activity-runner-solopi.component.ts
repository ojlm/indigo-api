import { Component, Input, OnInit } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { RunTaskInBlob, UiDriverInfo, UiService } from 'app/api/service/ui.service'
import { NzMessageService } from 'ng-zorro-antd'

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

  loading = false

  constructor(
    private uiService: UiService,
    private msgService: NzMessageService,
    private sanitizer: DomSanitizer,
  ) { }

  run() {
    const drivers = this.drivers.filter(item => item._checked)
    if (this._file && this._file.data && this._file.data.blob && this._file.data.blob.key) {
      const params: RunTaskInBlob = {
        key: this._file.data.blob.key,
        servos: drivers.map(item => { return { host: item.host, port: item.port, hostname: item.hostname } })
      }
      this.loading = true
      this.uiService.runSolopi(this.group, this.project, this._file._id, params).subscribe(res => {
        this.msgService.success('ok')
        this.loading = false
      }, _ => this.loading = false)
    }
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
