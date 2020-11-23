import { Component, HostListener, OnInit } from '@angular/core'
import { FeedItem, FeedResponse, feedResponseToFeedItems, SearchAfterActivity } from 'app/api/service/activity.service'
import { CountService } from 'app/api/service/count.service'
import { QueryUser, UserService } from 'app/api/service/user.service'
import { ApiRes } from 'app/model/api.model'
import { UserProfile } from 'app/model/user.model'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-system-activity',
  templateUrl: './system-activity.component.html',
  styleUrls: ['./system-activity.component.css']
})
export class SystemActivityComponent implements OnInit {

  isUserSearchLoading = false
  userQuerySubject: Subject<QueryUser>
  users: UserProfile[] = []
  selectedUser: UserProfile

  feedHeight = `${window.innerHeight - 96}px`
  searchFeed: SearchAfterActivity = {}
  searchFeedSubject: Subject<SearchAfterActivity>
  searchFeedResponse: Subject<ApiRes<FeedResponse>> = new Subject()
  hasMoreFeeds = true
  items: FeedItem[] = []
  feedSort: any[] = []

  @HostListener('window:resize')
  resize() {
    this.feedHeight = `${window.innerHeight - 96}px`
  }

  constructor(
    private userService: UserService,
    private countService: CountService,
  ) { }

  userLabel(item: UserProfile) {
    return this.userService.getUserLabel(item)
  }

  userAvatarText(item: UserProfile) {
    return this.userService.getAvatarText(item)
  }

  searchUser(text: string) {
    this.isUserSearchLoading = true
    this.userQuerySubject.next({ text: text })
  }

  userChange() {
    this.hasMoreFeeds = true
    this.items = []
    this.feedSort = []
    if (this.selectedUser) {
      this.searchFeed.user = this.selectedUser.username
    } else {
      this.searchFeed.user = undefined
    }
    this.doSearch()
  }

  onScroll() {
    this.doSearch()
  }

  doSearch() {
    if (this.hasMoreFeeds) {
      const search: SearchAfterActivity = {
        ...this.searchFeed,
        size: 20,
        sort: this.feedSort,
      }
      this.searchFeedSubject.next(search)
    }
  }

  ngOnInit() {
    const userResponse = new Subject<ApiRes<UserProfile[]>>()
    this.userQuerySubject = this.userService.newQuerySubject(userResponse)
    userResponse.subscribe(res => {
      this.isUserSearchLoading = false
      this.users = res.data.list
    }, _ => this.isUserSearchLoading = false)
    this.searchFeedSubject = this.countService.activityFeedSubject(this.searchFeedResponse)
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
