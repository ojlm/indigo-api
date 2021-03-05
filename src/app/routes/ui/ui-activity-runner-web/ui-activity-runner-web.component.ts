import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { FileNodeService } from 'app/api/service/file.node.service'
import { ChromeTargetPage, DriverCommand, UiDriverInfo, UiService } from 'app/api/service/ui.service'
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
        servos: drivers.map(item => { return { host: item.host, port: item.port, hostname: item.hostname, electron: item.electron } }),
        options: this.options,
      }
      this.loading = true
      this.uiService.runCommand(this.group, this.project, this._file._id, command).subscribe(res => {
        this.msgService.success('ok')
        this.loading = false
      }, _ => this.loading = false)
    }
  }

  getDevtoolsUrl(host: string, port: number, target: ChromeTargetPage) {
    return `http://${host}:${port}/devtools/inspector.html?ws=${host}:${port}/devtools/page/${target.id}`
  }

  openTarget(item: UiDriverInfo, target: ChromeTargetPage) {
    const url = this.getDevtoolsUrl(item.host, item.port, target)
    const width = window.screen.availWidth / 2
    const height = window.screen.availHeight / 2
    window.open(url, '_blank', `width=${width},height=${height},left=${width / 2},top=${height / 2}`)
  }

  openConsole(item: UiDriverInfo) {
    let url
    if (item.targets && item.targets.length == 1) {
      url = this.getDevtoolsUrl(item.host, item.port, item.targets[0])
    } else if (item.targets.length > 1) {
      if (item.debuggerUrl || item.startUrl) {
        const target = item.targets.find(target => target.webSocketDebuggerUrl === item.debuggerUrl || target.url === item.startUrl)
        if (target) {
          url = this.getDevtoolsUrl(item.host, item.port, target)
        }
      } else {
        const target = item.targets.find(target => target.type === 'page')
        if (target) {
          url = this.getDevtoolsUrl(item.host, item.port, target)
        }
      }
    }
    if (url) {
      const width = window.screen.availWidth / 2
      const height = window.screen.availHeight / 2
      window.open(url, '_blank', `width=${width},height=${height},left=${width / 2},top=${height / 2}`)
    }
  }

  openVnc(item: UiDriverInfo) {
    const width = window.screen.availWidth / 2
    const height = window.screen.availHeight / 2
    window.open(`http://${item.host}:${item.port}/vnc?password=${item.password}`, '_blank', `width=${width},height=${height},left=${width / 2},top=${height / 2}`)
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

