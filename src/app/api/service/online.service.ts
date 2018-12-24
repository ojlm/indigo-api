import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { DomainOnlineConfig, DomainOnlineLog, IndexDocResponse, Metrics, RestApiOnlineLog } from 'app/model/es.model'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, DataBody, QueryPage } from '../../model/api.model'
import { API_ONLINE } from '../path'
import { AggsItem, AggsQuery, BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class OnlineService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  queryDomain(query: QueryDomain) {
    return this.http.post<ApiRes<QueryDomainResponse>>(`${API_ONLINE}/domain`, query)
  }

  aggDomainTerms(query: AggsQuery) {
    return this.http.post<ApiRes<AggsItem[]>>(`${API_ONLINE}/domain/aggs/terms`, query)
  }

  aggDomainTermsSubject(response: Subject<ApiRes<AggsItem[]>>) {
    const querySubject = new Subject<AggsQuery>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<AggsItem[]>>(`${API_ONLINE}/domain/aggs/terms`, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  queryApi(query: QueryOnlineApi, hasDomain: boolean) {
    let queryStr = ''
    if (!(undefined === hasDomain || null === hasDomain)) {
      queryStr = `?hasDomain=${hasDomain}`
    }
    return this.http.post<ApiRes<QueryOnlineApiResponse>>(`${API_ONLINE}/api${queryStr}`, query)
  }

  queryApiSubject(response: Subject<ApiRes<QueryOnlineApiResponse>>) {
    const querySubject = new Subject<QueryOnlineApiSubjectSearch>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      let queryStr = ''
      if (!(undefined === query.hasDomain || null === query.hasDomain)) {
        queryStr = `?hasDomain=${query.hasDomain}`
      }
      this.http.post<ApiRes<QueryOnlineApiResponse>>(`${API_ONLINE}/api${queryStr}`, query.query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  putDomainConfig(config: DomainOnlineConfig) {
    return this.http.put<ApiRes<IndexDocResponse>>(`${API_ONLINE}/domain/config`, config)
  }

  getDomainConfig(name: string) {
    return this.http.get<ApiRes<DomainOnlineConfig>>(`${API_ONLINE}/domain/config/${name}`)
  }

  peviewDomainConfigResults(config: PreviewOnlineApi) {
    return this.http.post<ApiRes<RestApiOnlineLog[]>>(`${API_ONLINE}/domain/config/preview`, config)
  }

  getApiPerfMetics(query: QueryOnlineApi) {
    return this.http.post<ApiRes<ApiMetrics[]>>(`${API_ONLINE}/api/metrics`, query)
  }
}

export interface QueryDomain extends QueryPage {
  names?: string[]
  date?: string
}

export interface QueryOnlineApi extends QueryPage {
  domain?: string
  method?: string
  urlPath?: string
  date?: string
  sortField?: string
  asc?: boolean
}

export interface QueryOnlineApiSubjectSearch {
  query: QueryOnlineApi
  hasDomain: boolean
}

export interface QueryDomainResponse {
  dates?: AggsItem[]
  count?: DataBody<DomainOnlineLog[]>
  coverage?: DataBody<DomainOnlineLog[]>
}

export interface QueryOnlineApiResponse {
  domain?: DataBody<DomainOnlineLog[]>
  apis?: DataBody<RestApiOnlineLog[]>
}

export interface PreviewOnlineApi {
  config?: DomainOnlineConfig
  domainTotal?: number
}

export interface ApiMetrics {
  date?: string
  metrics?: Metrics
}
