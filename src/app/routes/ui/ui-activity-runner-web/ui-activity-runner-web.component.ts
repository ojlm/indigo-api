import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { UiDriverInfo, UiService } from 'app/api/service/ui.service'

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

  drivers: UiDriverInfo[] = []
  selectedDriver: UiDriverInfo
  options: CommandOptions = { saveCommandLog: false, saveDriverLog: true }

  constructor(
    private uiService: UiService,
    private sanitizer: DomSanitizer,
  ) { }

  startCommand() {
    console.log(this._file)
  }

  showPanel(show: boolean) {
    return show ? 'none' : this.sanitizer.bypassSecurityTrustStyle('grayscale(1)')
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

