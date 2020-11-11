import { Component, HostListener, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import {
  ActivityService,
  FeedItem,
  FeedResponse,
  feedResponseToFeedItems,
  RecommendProject,
  SearchAfterActivity,
} from 'app/api/service/activity.service'
import { GroupService } from 'app/api/service/group.service'
import { ProjectService, QueryProject } from 'app/api/service/project.service'
import { ApiRes } from 'app/model/api.model'
import { Group, Project } from 'app/model/es.model'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tabbarStyle = {
    margin: '0px',
  }
  onlyMe = true
  height = `${window.innerHeight - 48}px`
  backupMy: RecommendProjectEx[] = []
  my: RecommendProjectEx[] = []
  others: RecommendProjectEx[] = []
  wd = ''
  queryProjectSubject = new Subject<QueryProject>()
  searchFeed: SearchAfterActivity = {}
  searchFeedSubject: Subject<SearchAfterActivity>
  searchFeedResponse: Subject<ApiRes<FeedResponse>> = new Subject()
  hasMoreFeeds = true
  items: FeedItem[] = []
  feedSort: any[] = []
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
    const response = new Subject<ApiRes<Project[]>>()
    this.queryProjectSubject = this.projectService.newQuerySubject(response)
    response.subscribe(res => {
      this.my = fillGroupData(res.data.list, res.data['groups'])
    })
  }

  itemBreadcrumb(item: RecommendProjectEx) {
    const group = item._group ? this.groupService.getBreadcrumb(item._group) : item.group
    const project = item.summary || item.project
    return `${group}/${project}`
  }

  searchProject() {
    if (this.wd || this.backupMy.length === 0) {
      this.queryProjectSubject.next({ text: this.wd, includeGroup: true })
    } else {
      this.my = [...this.backupMy]
    }
  }

  goProject(item: RecommendProject) {
    this.router.navigateByUrl(`/${item.group}/${item.project}`)
  }

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
    this.activityService.recentProjectsWithOthers().subscribe(res => {
      this.my = fillGroupData(res.data.my, res.data.groups)
      this.backupMy = [...this.my]
      if (this.backupMy.length === 0) {
        this.searchProject()
      }
      this.others = fillGroupData(res.data.others, res.data.groups)
    })
    this.searchFeedSubject = this.activityService.selfSearchAfterSubject(this.searchFeedResponse)
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

function fillGroupData(items: RecommendProject[], groups: { [k: string]: Group }) {
  if (items && groups) {
    items.forEach(item => (item as RecommendProjectEx)._group = groups[item.group])
  }
  return items as RecommendProjectEx[]
}

interface RecommendProjectEx extends RecommendProject {
  _group?: Group
}
