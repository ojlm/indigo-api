import { formatDate } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { UiService } from 'app/api/service/ui.service'

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

  timeStr(item: LogEntry) {
    return formatDate(item.timestamp, 'yyyy-MM-dd hh:mm:ss.SSS', 'zh')
  }

  textStr(item: LogEntry) {
    switch (item.type) {
      case 'monkey':
        return JSON.stringify(item.data)
      case 'console':
        return JSON.stringify(item.data)
      default:
        return JSON.stringify(item.data)
    }
  }

  ngOnInit(): void {
  }

}
