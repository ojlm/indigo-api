import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { XtermService } from '@core/config/xterm.service'
import RFB from '@novnc/novnc/core/rfb.js'
import {
  DriverCommand,
  DriverCommandLog,
  DriverCommandStart,
  DriverStatus,
  UiDriverAddress,
  UiService,
} from 'app/api/service/ui.service'
import { ActorEvent } from 'app/model/api.model'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CommandOptions, FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-activity-runner',
  templateUrl: './ui-activity-runner.component.html',
  styleUrls: ['./ui-activity-runner.component.css']
})
export class UiActivityRunnerComponent implements OnInit, OnDestroy {

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

  driverWs: WebSocket
  rfb: RFB
  drivers: UiDriverAddress[] = []
  driverStatus: DriverStatus = {}
  selectedDriver: UiDriverAddress
  log = new Subject<string>()

  options: CommandOptions = { saveCommandLog: false, saveDriverLog: true }

  constructor(
    private uiService: UiService,
    private msgService: NzMessageService,
    private xtermService: XtermService,
  ) { }

  getDriverLabel(driver: UiDriverAddress) {
    return this.uiService.getDriverLabel(driver)
  }

  driverChange() {
    if (this.selectedDriver) {
      this.refreshRfb(this.selectedDriver)
      this.connectDriver(this.selectedDriver)
    }
  }

  startCommand() {
    this.driverWs.send(JSON.stringify({
      name: this._file.name,
      description: this._file.description,
      type: 'monkey',
      params: this._file.data,
      options: this.options,
    }))
  }

  stopCommand() {
    if (this.driverWs && this.driverWs.readyState === this.driverWs.OPEN) {
      const driverCommand: DriverCommand = {
        type: 'stop',
      }
      this.driverWs.send(JSON.stringify(driverCommand))
    }
  }

  connectDriver(driver: UiDriverAddress) {
    if (this.driverWs) {
      this.driverWs.close()
      this.driverWs = null
    }
    this.driverWs = this.uiService.connectDriver(driver, this.group, this.project, this.id)
    this.driverWs.onmessage = (event) => {
      if (event.data) {
        try {
          const msg = JSON.parse(event.data) as ActorEvent<any>
          switch (msg.type) {
            case 'command.start':
              const data = msg.data as DriverCommandStart
              if (!data.ok) {
                this.msgService.error(data.msg)
              }
              this.driverStatus = data.status
              break
            case 'command.log':
              const log = msg.data as DriverCommandLog
              const command = this.xtermService.wrapBlue(log.command)
              const type = this.xtermService.wrapMagenta(log.type)
              this.log.next(`[${command}][${type}]${log.type === 'mouse' ? JSON.stringify(log.params) : log.params}`)
              break
            case 'driver.status':
              this.driverStatus = msg.data
              break
            case 'driver.log':
              console.log('driver:', msg.data)
              if (msg.data.method === 'Log.entryAdded' && msg.data.params && msg.data.params.entry) {
                const entry = msg.data.params.entry as LogEntry
                const console = this.xtermService.wrapBlue('console')
                let level
                if (entry.level === 'warning') {
                  level = this.xtermService.wrapYellow(entry.level)
                } else if (entry.level === 'red') {
                  level = this.xtermService.wrapRed(entry.level)
                } else {
                  level = entry.level
                }
                this.log.next(`[${console}][${level}]${entry.text}`)
              }
              break
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
  }

  refreshRfb(driver: UiDriverAddress) {
    const url = this.uiService.getRfbProxyUrl(driver, this.group, this.project, this.id)
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

  loadDrivers() {
    this.uiService.getDriverList(this.group, this.project).subscribe(res => {
      this.drivers = res.data
      if (this.drivers.length > 0) {
        this.selectedDriver = this.drivers[0]
        this.driverChange()
      }
    })
  }

  ngOnDestroy(): void {
    if (this.driverWs) {
      this.driverWs.close()
      this.driverWs = null
    }
    if (this.rfb) {
      this.rfb.disconnect()
    }
  }

  ngOnInit(): void {
  }

}

export interface LogEntry {
  level?: string
  source?: string
  text?: string
  timestamp?: number
  url?: string
}
