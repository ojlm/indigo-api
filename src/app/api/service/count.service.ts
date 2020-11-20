import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes } from '../../model/api.model'
import { API_COUNT } from '../path'
import { FeedResponse, SearchAfterActivity } from './activity.service'
import { AggsItem, AggsQuery, BaseService, TrendResponse } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class CountService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  activityFeedSubject(response: Subject<ApiRes<FeedResponse>>) {
    const querySubject = new Subject<SearchAfterActivity>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<FeedResponse>>(`${API_COUNT}/activity/feed`, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  all() {
    return this.http.get<ApiRes<AllResponse>>(`${API_COUNT}/all`)
  }

  httpAggs(aggs: AggsQuery) {
    return this.http.post<ApiRes<AggsItem[]>>(`${API_COUNT}/aggs/http`, aggs)
  }

  httpTrend(aggs: AggsQuery, groups: boolean = null) {
    return this.http.post<ApiRes<TrendResponse>>(
      `${API_COUNT}/aggs/trend/http${groups !== null ? '?groups=' + groups : ''}`, aggs
    )
  }

  activityTrend(aggs: AggsQuery) {
    return this.http.post<ApiRes<TrendResponse>>(`${API_COUNT}/aggs/trend/activity`, aggs)
  }

  activityAggTermsSubject(response: Subject<ApiRes<AggsItem[]>>) {
    const querySubject = new Subject<AggsQuery>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<AggsItem[]>>(`${API_COUNT}/aggs/terms/activity`, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }
}

export interface AllResponse {
  count: AllCountResponse
  histogram: AllHistogramResponse
}

export interface AllCountResponse {
  'http': number
  'dubbo': number
  'sql': number
  'scenario': number
  'job': number
  'webHttp': number
  'webDubbo': number
  'webSql': number
  'webScenario': number
  'webJob': number
  'ciJob': number
  'quartzJob': number
}

export interface AllHistogramResponse {
  'http': AggsItem[]
  'dubbo': AggsItem[]
  'sql': AggsItem[]
  'scenario': AggsItem[]
  'job': AggsItem[]
  'webHttp': AggsItem[]
  'webDubbo': AggsItem[]
  'webSql': AggsItem[]
  'webScenario': AggsItem[]
  'webJob': AggsItem[]
  'ciJob': AggsItem[]
  'quartzJob': AggsItem[]
}
