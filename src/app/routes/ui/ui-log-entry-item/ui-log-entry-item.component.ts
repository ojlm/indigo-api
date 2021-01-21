import { formatDate } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { UiService } from 'app/api/service/ui.service'
import { syntaxHighlight } from 'app/util/json'

import { LogEntry } from '../ui.model'

@Component({
  selector: 'app-ui-log-entry-item',
  templateUrl: './ui-log-entry-item.component.html',
  styleUrls: ['./ui-log-entry-item.component.css']
})
export class UiLogEntryItemComponent implements OnInit {

  _item: LogEntry = {}
  @Input()
  set item(val: LogEntry) {
    this._item = val
  }

  constructor(
    private uiService: UiService,
  ) { }

  timeStr() {
    return formatDate(this._item.timestamp, 'yyyy-MM-dd hh:mm:ss.SSS', 'zh')
  }

  levelColor() {
    switch (this._item.level) {
      case 'error':
        return 'red'
      case 'warning':
        return 'orange'
      case 'info':
        return 'lightseagreen'
      default:
        return 'lightskyblue'
    }
  }

  levelStr() {
    return this._item.level
  }

  textStr() {
    const item = this._item
    switch (item.type) {
      case 'monkey':
        return JSON.stringify(item.data)
      case 'console':
        if (item.text) {
          return item.text
        } else {
          return JSON.stringify(item.data)
        }
      default:
        return JSON.stringify(item.data)
    }
  }

  debug() {
    syntaxHighlight(this._item, true)
  }

  ngOnInit(): void {
  }

}

export interface StackTrace {
  callFrames?: {
    columnNumber?: number
    functionName?: string
    lineNumber?: number
    scriptId?: string
    url?: string
  }[]
}

export interface DevConsoleData {
  type?: string
  args?: { type: string, value: any }[]
  executionContextId?: number
  stackTrace?: StackTrace
}
