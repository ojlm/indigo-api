import { Component, Input, OnInit } from '@angular/core'
import { SearchAfterLogEntry, UiService } from 'app/api/service/ui.service'
import { ApiRes } from 'app/model/api.model'
import { Subject } from 'rxjs'

import { LogEntry, UiTaskReport } from '../ui.model'

@Component({
  selector: 'app-ui-log-entry',
  templateUrl: './ui-log-entry.component.html',
  styleUrls: ['./ui-log-entry.component.css']
})
export class UiLogEntryComponent implements OnInit {

  searchFeed: SearchAfterLogEntry = { size: 200 }
  searchFeedSubject: Subject<SearchAfterLogEntry>
  searchFeedResponse: Subject<ApiRes<LogEntry[]>> = new Subject()
  hasMoreFeeds = true
  items: LogEntry[] = []
  feedSort: any[] = []

  _height = '480px'
  @Input()
  set height(val: number) {
    this._height = `${val}px`
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

  onScroll() {
    this.loadLogs()
  }

  loadLogs() {
    if (this.hasMoreFeeds) {
      const search: SearchAfterLogEntry = {
        ...this.searchFeed,
        sort: this.feedSort,
      }
      this.searchFeedSubject.next(search)
    }
  }

  ngOnInit(): void {
  }

}
