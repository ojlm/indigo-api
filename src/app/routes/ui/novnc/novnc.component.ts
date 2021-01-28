import { AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core'
import { XtermService } from '@core/config/xterm.service'
import RFB from '@novnc/novnc/core/rfb.js'
import {
  DriverCommand,
  DriverCommandLog,
  DriverCommandStart,
  DriverStatus,
  UiDriverInfo,
  UiService,
} from 'app/api/service/ui.service'
import { ActorEvent } from 'app/model/api.model'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { DRIVERS } from '../ui.model'

@Component({
  selector: 'app-novnc',
  templateUrl: './novnc.component.html',
  styleUrls: ['./novnc.component.css']
})
export class NovncComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() group = 'indigo'
  @Input() project = 'indigo'

  tabIndex = 0
  showConsole = false
  driverWs: WebSocket
  rfb: RFB

  drivers: UiDriverInfo[] = []
  commands = ['monkey', 'karate']

  driverStatus: DriverStatus = {}
  selectedDriver: UiDriverInfo
  selectedCommand = this.commands[0]
  params: any

  height = `${window.innerHeight - 24 - 36}px`
  contentHeight = `${window.innerHeight - 24 - 36 - 40}px`
  log = new Subject<string>()

  @HostListener('window:resize')
  resizeBy() {
    this.height = `${window.innerHeight - 24 - 36}px`
    this.contentHeight = `${window.innerHeight - 24 - 36 - 40}px`
  }

  constructor(
    private uiService: UiService,
    private msgService: NzMessageService,
    private xtermService: XtermService,
  ) { }

  tabChange() {
    if (this.tabIndex === 0 && this.selectedCommand === 'karate') {
      setTimeout(_ => {
        window.dispatchEvent(new Event('resize'))
      }, 10)
    }
    if (this.tabIndex === 1) {
      this.showConsole = true
    }
  }

  getDriverLabel(driver: UiDriverInfo) {
    return this.uiService.getDriverLabel(driver)
  }

  driverChange() {
    if (this.selectedDriver) {
      this.refreshRfb(this.selectedDriver)
      this.connectDriver(this.selectedDriver)
    }
  }

  startCommand() {
    if (this.params && this.driverWs && this.driverWs.readyState === this.driverWs.OPEN) {
      const driverCommand: DriverCommand = {
        type: this.selectedCommand,
        params: this.params
      }
      this.driverWs.send(JSON.stringify(driverCommand))
      this.tabIndex = 1
    }
  }

  stopCommand() {
    if (this.params && this.driverWs && this.driverWs.readyState === this.driverWs.OPEN) {
      const driverCommand: DriverCommand = {
        type: 'stop',
      }
      this.driverWs.send(JSON.stringify(driverCommand))
    }
  }

  commandChange() {
    this.params = null
  }

  connectDriver(driver: UiDriverInfo) {
    if (this.driverWs) {
      this.driverWs.close()
      this.driverWs = null
    }
    this.driverWs = this.uiService.connectDriver(driver, this.group, this.project, 'test')
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

  refreshRfb(driver: UiDriverInfo) {
    const url = this.uiService.getRfbProxyUrl(driver, this.group, this.project, 'test')
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

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.uiService.getDriverList(this.group, this.project, DRIVERS.CHROME).subscribe(res => {
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
  }

}

export interface LogEntry {
  level?: string
  source?: string
  text?: string
  timestamp?: number
  url?: string
}
