import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { Activity, Case, DubboRequest, Group, Job, Project, Scenario, SqlRequest } from 'app/model/es.model'
import { UserProfile } from 'app/model/user.model'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes } from '../../model/api.model'
import { API_ACTIVITY } from '../path'
import { BaseService } from './base.service'
import { SearchAfter } from './case.service'

@Injectable({
  providedIn: 'root'
})
export class ActivityService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  recentSubject(response: Subject<ApiRes<RecommendProjects>>) {
    const querySubject = new Subject<string>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(wd => {
      this.http.get<ApiRes<RecommendProjects>>(`${API_ACTIVITY}/recent${wd ? '?wd=' + wd : ''}`).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  recentProjectsWithoutOthers() {
    return this.http.get<ApiRes<RecommendProjects>>(`${API_ACTIVITY}/recent/projects?discover=false`)
  }

  recentProjectsWithOthers() {
    return this.http.get<ApiRes<RecommendProjects>>(`${API_ACTIVITY}/recent/projects?discover=true`)
  }

  selfSearchAfterSubject(response: Subject<ApiRes<FeedResponse>>) {
    const querySubject = new Subject<SearchAfterActivity>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<FeedResponse>>(`${API_ACTIVITY}/feed/self`, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }
}

export interface RecommendProject {
  group?: string
  project?: string
  count?: number
  summary?: string
  description?: string
}

export interface RecommendProjects {
  my?: RecommendProject[]
  others?: RecommendProject[]
  groups?: { [k: string]: Group }
}

export interface SearchAfterActivity extends SearchAfter {
  type?: string
  onlyMe?: boolean
  user?: string
}

export interface ActivityWithSort extends Activity {
  _sort: any[]
}

export interface FeedResponse {
  list?: ActivityWithSort[]
  total?: number
  users?: { [k: string]: UserProfile }
  group?: { [k: string]: Group }
  project?: { [k: string]: Project }
  http?: { [k: string]: Case }
  dubbo?: { [k: string]: DubboRequest }
  sql?: { [k: string]: SqlRequest }
  scenario?: { [k: string]: Scenario }
  job?: { [k: string]: Job }
}

export interface FeedItem {
  group?: Group
  project?: Project
  activity?: ActivityWithSort
  user?: UserProfile
  data?: Group | Project | Case | DubboRequest | SqlRequest | SqlRequest | Job
}

export const ActivityType = {
  TYPE_NEW_USER: 'new-user',
  TYPE_NEW_CASE: 'new-case',
  TYPE_TEST_CASE: 'test-case',
  TYPE_NEW_GROUP: 'new-group',
  TYPE_NEW_PROJECT: 'new-project',
  TYPE_NEW_SCENARIO: 'new-scenario',
  TYPE_TEST_SCENARIO: 'test-scenario',
  TYPE_NEW_JOB: 'new-job',
  TYPE_TEST_JOB: 'test-job',
  TYPE_NEW_DUBBO: 'new-dubbo',
  TYPE_TEST_DUBBO: 'test-dubbo',
  TYPE_NEW_SQL: 'new-sql',
  TYPE_TEST_SQL: 'test-sql',
}

export function feedResponseToFeedItems(response: FeedResponse) {
  const items: FeedItem[] = []
  response.list.forEach(activity => {
    const type = activity.type
    const targetId = activity.targetId
    let data: any
    switch (type) {
      case ActivityType.TYPE_NEW_USER:
        break
      case ActivityType.TYPE_NEW_GROUP:
        data = response.group[targetId]
        break
      case ActivityType.TYPE_NEW_PROJECT:
        data = response.project[targetId]
        break
      case ActivityType.TYPE_NEW_CASE:
      case ActivityType.TYPE_TEST_CASE:
        data = response.http[targetId]
        break
      case ActivityType.TYPE_NEW_DUBBO:
      case ActivityType.TYPE_TEST_DUBBO:
        data = response.dubbo[targetId]
        break
      case ActivityType.TYPE_NEW_SQL:
      case ActivityType.TYPE_TEST_SQL:
        data = response.sql[targetId]
        break
      case ActivityType.TYPE_NEW_SCENARIO:
      case ActivityType.TYPE_TEST_SCENARIO:
        data = response.scenario[targetId]
        break
      case ActivityType.TYPE_NEW_JOB:
      case ActivityType.TYPE_TEST_JOB:
        data = response.job[targetId]
        break
      default:
        break
    }
    if (type === ActivityType.TYPE_NEW_USER) {
      items.push({
        activity: activity,
        user: response.users[activity.user],
      })
    } else {
      if (data) {
        // data must be there
        let group: Group
        let project: Project
        if (activity.group && response.group) group = response.group[activity.group]
        if (group && response.project) {
          project = response.project[`${group.id}_${activity.project}`]
        }
        items.push({
          group: group,
          project: project,
          activity: activity,
          user: response.users[activity.user],
          data: data
        })
      }
    }
  })
  return items
}
