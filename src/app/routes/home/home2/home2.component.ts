import { Component, HostListener, OnInit } from '@angular/core'
import {
  ActivityService,
  FeedItem,
  FeedResponse,
  feedResponseToFeedItems,
  SearchAfterActivity,
} from 'app/api/service/activity.service'
import { ApiRes } from 'app/model/api.model'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.css']
})
export class Home2Component implements OnInit {

  feedHeight = `${window.innerHeight - 160}px`
  cardBodyStyle = {
    padding: '12px 16px',
  }
  onlyMe = true
  searchFeed: SearchAfterActivity = {}
  searchFeedSubject: Subject<SearchAfterActivity>
  searchFeedResponse: Subject<ApiRes<FeedResponse>> = new Subject()
  hasMoreFeeds = true
  items: FeedItem[] = []
  feedSort: any[] = []

  @HostListener('window:resize')
  resize() {
    this.feedHeight = `${window.innerHeight - 160}px`
  }

  constructor(
    private activityService: ActivityService,
  ) { }

  onScroll() {
    this.doSearch()
  }

  resetFeed() {
    this.feedSort = []
    this.items = []
    this.hasMoreFeeds = true
    this.doSearch()
  }

  doSearch() {
    if (this.hasMoreFeeds) {
      const search: SearchAfterActivity = {
        ...this.searchFeed,
        size: 20,
        sort: this.feedSort,
        onlyMe: this.onlyMe,
      }
      this.searchFeedSubject.next(search)
    }
  }

  ngOnInit() {
    this.searchFeedSubject = this.activityService.searchAfterSubject(this.searchFeedResponse)
    this.searchFeedResponse.subscribe(res => {
      this.items = [...this.items, ...feedResponseToFeedItems(res.data)]
      if (res.data.list.length > 0) {
        const last = res.data.list[res.data.list.length - 1]
        this.feedSort = last._sort
      }
      if (res.data.list.length < 20) {
        this.hasMoreFeeds = false
      }
    })
    this.doSearch()
  }
}
