import { Component, Input, OnInit } from '@angular/core'
import { AggsResult, SearchAfterLogEntry, UiService } from 'app/api/service/ui.service'
import { ApiRes } from 'app/model/api.model'
import { NameValue } from 'app/model/common.model'
import { Subject } from 'rxjs'

import { LogEntry, UiTaskReport } from '../ui.model'

@Component({
  selector: 'app-ui-log-entry',
  templateUrl: './ui-log-entry.component.html',
  styleUrls: ['./ui-log-entry.component.css']
})
export class UiLogEntryComponent implements OnInit {

  type: NameValue
  source: NameValue
  method: NameValue
  hostname = ''

  sourceItems: NameValue[] = []
  methodItems: NameValue[] = []

  searchFeed: SearchAfterLogEntry = { size: 100, desc: false }
  searchFeedSubject: Subject<SearchAfterLogEntry>
  searchFeedResponse: Subject<ApiRes<LogEntry[]>> = new Subject()
  hasMoreFeeds = true
  items: LogEntry[] = []
  feedSort: any[] = []

  levels: LabelModel[] = [
    { label: 'unknown', value: 'unknown', },
    { label: 'log', value: 'log', },
    { label: 'info', value: 'info', },
    { label: 'warning', value: 'warning', },
    { label: 'error', value: 'error' },
  ]
  @Input() aggs: AggsResult
  _height = '480px'
  @Input()
  set height(val: number) {
    this._height = `${val - 32}px`
  }
  @Input()
  set report(val: UiTaskReport) {
    if (val._id) {
      this.searchFeed.day = val.day
      this.searchFeed.reportId = val._id
      this.searchFeedSubject = this.uiService.getReportLogsSubject(val.group, val.project, val._id, this.searchFeedResponse)
      this.searchFeedResponse.subscribe(res => {
        this.items = [...this.items, ...res.data.list]
        this.feedSort = (res.data as any)['sort']
        if (res.data.list.length < this.searchFeed.size) {
          this.hasMoreFeeds = false
        }
      })
      this.loadLogs()
    }
  }

  constructor(
    private uiService: UiService,
  ) { }

  changeSort() {
    this.searchFeed.desc = !this.searchFeed.desc
    this.reset()
  }

  levelsChange() {
    this.searchFeed.levels = this.levels.filter(item => item.checked).map(item => item.value)
    this.reset()
  }

  reset() {
    this.items = []
    this.feedSort = []
    this.hasMoreFeeds = true
    this.loadLogs()
  }

  onScroll() {
    this.loadLogs()
  }

  loadLogs() {
    if (this.hasMoreFeeds) {
      const search: SearchAfterLogEntry = {
        ...this.searchFeed,
        type: this.type ? [this.type.name] : undefined,
        source: this.source ? [this.source.name] : undefined,
        method: this.method ? [this.method.name] : undefined,
        hostname: this.hostname ? [this.hostname] : undefined,
        sort: this.feedSort,
      }
      this.searchFeedSubject.next(search)
    }
  }

  ngOnInit(): void {
  }

}

interface LabelModel {
  label: string
  value: string
  checked?: boolean
}
