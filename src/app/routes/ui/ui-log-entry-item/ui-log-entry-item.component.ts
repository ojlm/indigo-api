import { formatDate } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { FilesizePipe } from 'app/pipe/file-size.pipe'
import { syntaxHighlight } from 'app/util/json'
import { NzModalService } from 'ng-zorro-antd'

import { UiBlobstoreViewerComponent } from '../ui-blobstore-viewer/ui-blobstore-viewer.component'
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
    private fileSize: FilesizePipe,
    private modalService: NzModalService,
  ) { }

  openViewer() {
    if (this._item.data && this._item.data.params && this._item.data.params.store) {
      this.modalService.create({
        nzCancelText: null,
        nzOkText: null,
        nzFooter: null,
        nzWidth: window.innerWidth * 0.8,
        nzContent: UiBlobstoreViewerComponent,
        nzComponentParams: {
          item: this._item,
        },
      })
    }
  }

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
    return this._item.level || this._item.source
  }

  screenCaptureStr() {
    if (this._item.data && this._item.data.params) {
      const params = this._item.data.params
      const size = params.store && params.store.contentLength > 0 ? params.store.contentLength : 0
      return `:${params.locator || 'body'}, ${this.fileSize.transform(size)}`
    } else {
      return ''
    }
  }

  textStr() {
    const item = this._item
    switch (item.type) {
      case 'monkey':
        switch (item.source) {
          case 'log':
            return item.data.params
          case 'mouse':
            const params = item.data.params
            return `${params.button || ''} ${params.type} ${params.clickCount || ''} (${params.x}, ${params.y}) ${params.deltaX || params.deltaY ? `deltaX:${params.deltaX}, deltaY:${params.deltaY}` : ''}`
          case 'keyboard':
            return item.data.params
          case 'screen':
            return 'screen'
          default:
            return JSON.stringify(item.data)
        }
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
