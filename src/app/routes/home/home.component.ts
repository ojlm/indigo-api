import { Component, HostListener, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import {
  ActivityService,
  FeedItem,
  FeedResponse,
  feedResponseToFeedItems,
  RecommendProject,
  RecommendProjects,
  SearchAfterActivity,
} from 'app/api/service/activity.service'
import { GroupService } from 'app/api/service/group.service'
import { ProjectService } from 'app/api/service/project.service'
import { ApiRes } from 'app/model/api.model'
import { Group } from 'app/model/es.model'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  height = `${window.innerHeight - 48}px`
  my: RecommendProjectEx[] = []
  others: RecommendProjectEx[] = []
  wd = ''
  queryProjectSubject = new Subject<string>()
  searchFeed: SearchAfterActivity = {}
  searchFeedSubject: Subject<SearchAfterActivity>
  searchFeedResponse: Subject<ApiRes<FeedResponse>> = new Subject()
  hasMoreFeeds = true
  items: FeedItem[] = []
  feedSort: any[] = []
  response: FeedResponse = {}
  @HostListener('window:resize')
  resize() {
    this.height = `${window.innerHeight - 48}px`
  }
  constructor(
    private activityService: ActivityService,
    private groupService: GroupService,
    private projectService: ProjectService,
    private router: Router,
  ) {
    const response = new Subject<ApiRes<RecommendProjects>>()
    this.queryProjectSubject = this.activityService.recentSubject(response)
    response.subscribe(res => {
      this.my = fillGroupData(res.data.my, res.data.groups)
    })
  }

  itemBreadcrumb(item: RecommendProjectEx) {
    const group = item._group ? this.groupService.getBreadcrumb(item._group) : item.group
    const project = item.summary || item.project
    return `${group}/${project}`
  }

  searchProject() {
    this.queryProjectSubject.next(this.wd)
  }

  goProject(item: RecommendProject) {
    this.router.navigateByUrl(`/${item.group}/${item.project}`)
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
    this.activityService.recentWithOthers().subscribe(res => {
      this.my = fillGroupData(res.data.my, res.data.groups)
      this.others = fillGroupData(res.data.others, res.data.groups)
    })
    this.searchFeedSubject = this.activityService.searchAfterSubject(this.searchFeedResponse)
    this.searchFeedResponse.subscribe(res => {
      this.response = res.data
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

function fillGroupData(items: RecommendProject[], groups: { [k: string]: Group }) {
  if (items && groups) {
    items.forEach(item => (item as RecommendProjectEx)._group = groups[item.group])
  }
  return items as RecommendProjectEx[]
}

interface RecommendProjectEx extends RecommendProject {
  _group?: Group
}
