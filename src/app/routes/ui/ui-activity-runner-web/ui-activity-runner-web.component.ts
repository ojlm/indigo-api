import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { FileNodeService } from 'app/api/service/file.node.service'
import { DriverCommand, UiDriverInfo, UiService } from 'app/api/service/ui.service'
import { NzMessageService } from 'ng-zorro-antd'

import { CommandOptions, DRIVERS, FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-activity-runner-web',
  templateUrl: './ui-activity-runner-web.component.html',
  styleUrls: ['./ui-activity-runner-web.component.css']
})
export class UiActivityRunnerWebComponent implements OnInit, OnDestroy {

  group = ''
  project = ''
  id = ''
  _file: FileNode
  @Input()
  set file(val: FileNode) {
    this._file = val
    this.group = val.group
    this.project = val.project
    this.id = val._id
    if (this.group && this.project) {
      this.loadDrivers()
    }
  }

  loading = false
  drivers: UiDriverInfo[] = []
  selectedDriver: UiDriverInfo
  options: CommandOptions = { saveCommandLog: false, saveDriverLog: true }

  constructor(
    private fileNodeService: FileNodeService,
    private uiService: UiService,
    private msgService: NzMessageService,
    private sanitizer: DomSanitizer,
  ) { }

  startCommand() {
    const drivers = this.drivers.filter(item => item._checked)
    if (this._file && this._file.data) {
      const command: DriverCommand = {
        ...this.fileNodeService.toDriverCommand(this._file),
        servos: drivers.map(item => { return { host: item.host, port: item.port, hostname: item.hostname } }),
        options: this.options,
      }
      this.loading = true
      this.uiService.runCommand(this.group, this.project, this._file._id, command).subscribe(res => {
        this.msgService.success('ok')
        this.loading = false
      }, _ => this.loading = false)
    }
  }

  getImgSrc(item: UiDriverInfo) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${item.screenCapture}`)
  }

  loadDrivers() {
    this.uiService.getDriverList(this.group, this.project, DRIVERS.CHROME).subscribe(res => {
      this.drivers = res.data
    })
  }

  getUpdateTime(info: UiDriverInfo) {
    if (info.timestamp) {
      return new Date(info.timestamp).toLocaleString()
    }
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

}

