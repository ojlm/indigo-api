import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core'
import { XtermService } from '@core/config/xterm.service'
import { DriverCommandLog, DriverCommandStart, DriverStatus, UiDriverInfo, UiService } from 'app/api/service/ui.service'
import { ActorEvent } from 'app/model/api.model'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CommandOptions, FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-driver-vnc',
  templateUrl: './ui-driver-vnc.component.html',
})
export class UiDriverVncComponent implements AfterViewInit, OnDestroy {

  driverWs: WebSocket
  driverStatus: DriverStatus = {}
  log = new Subject<string>()

  @Input() height = 120
  @Input()
  set driver(val: UiDriverInfo) {
    if (val.host && val.port) {
      this.connectDriver(val)
    }
  }
  _file: FileNode = {}
  @Input()
  set file(val: FileNode) {
    this._file = val
  }
  @Input() options: CommandOptions

  constructor(
    private uiService: UiService,
    private msgService: NzMessageService,
    private xtermService: XtermService,
  ) { }


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
      const driverCommand: DriverCommandLog = {
        type: 'stop',
      }
      this.driverWs.send(JSON.stringify(driverCommand))
    }
  }

  connectDriver(driver: UiDriverInfo) {
    if (this.driverWs) {
      this.driverWs.close()
      this.driverWs = null
    }
    this.driverWs = this.uiService.connectDriver(driver, this._file.group, this._file.project, this._file._id)
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

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    if (this.driverWs) {
      this.driverWs.close()
      this.driverWs = null
    }
  }

}

export interface LogEntry {
  level?: string
  source?: string
  text?: string
  timestamp?: number
  url?: string
}
