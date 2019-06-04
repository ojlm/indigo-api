import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, QueryPage } from '../../model/api.model'
import {
  Case,
  CaseResult,
  ContextOptions,
  DeleteResData,
  IndexDocResponse,
  LabelRef,
  UpdateDocResponse,
} from '../../model/es.model'
import { API_CASE, API_CASE_QUERY, API_CASE_TEST, API_CASE_UPDATE } from '../path'
import { AggsItem, AggsQuery, BaseService, TrendResponse } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class CaseService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  query(query: QueryCase) {
    return this.http.post<ApiRes<Case[]>>(API_CASE_QUERY, query)
  }

  index(cs: Case) {
    return this.http.put(API_CASE, cs) as Observable<ApiRes<IndexDocResponse>>
  }

  delete(id: string, preview: boolean = null) {
    return this.http.delete(`${API_CASE}/${id}${preview === null ? '' : '?preview=' + preview}`) as Observable<ApiRes<DeleteResData>>
  }

  update(id: string, cs: Case) {
    return this.http.post<ApiRes<UpdateDocResponse>>(`${API_CASE_UPDATE}/${id}`, cs)
  }

  test(cs: { id: string, cs: Case, options: ContextOptions }) {
    return this.http.post<ApiRes<CaseResult>>(API_CASE_TEST, cs)
  }

  getById(id: string) {
    return this.http.get<ApiRes<Case>>(`${API_CASE}/${id}`)
  }

  newQuerySubject(response: Subject<ApiRes<Case[]>>) {
    const querySubject = new Subject<QueryCase>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<Case[]>>(API_CASE_QUERY, query).subscribe(
        res => response.next(res),
        err => response.next(null))
    })
    return querySubject
  }

  searchAfterSubject(response: Subject<ApiRes<CaseWithSort[]>>) {
    const querySubject = new Subject<SearchAfterCase>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<CaseWithSort[]>>(`${API_CASE}/after`, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  aggs(aggs: AggsQuery) {
    return this.http.post<ApiRes<AggsItem[]>>(`${API_CASE}/aggs`, aggs)
  }

  aggsSubject(response: Subject<ApiRes<AggsItem[]>>) {
    const querySubject = new Subject<AggsQuery>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<AggsItem[]>>(`${API_CASE}/aggs`, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  trend(aggs: AggsQuery, groups: boolean = null) {
    return this.http.post<ApiRes<TrendResponse>>(`${API_CASE}/aggs/trend${groups !== null ? '?groups=' + groups : ''}`, aggs)
  }

  aggsLabelsSubject(response: Subject<ApiRes<AggsItem[]>>) {
    const querySubject = new Subject<string>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(label => {
      this.http.get<ApiRes<AggsItem[]>>(`${API_CASE}/aggs/labels?label=${label}`).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  batchOperateLabels(ops: BatchOperationLabels) {
    return this.http.post<ApiRes<any>>(`${API_CASE}/batch/labels`, ops)
  }

  batchTransfer(ops: BatchTransfer) {
    return this.http.post<ApiRes<any>>(`${API_CASE}/batch/transfer`, ops)
  }
}

export interface QueryCase extends QueryPage {
  group?: string
  project?: string
  host?: string
  methods?: string[]
  path?: string
  text?: string
  ids?: string[]
  labels?: string[]
  hasCreators?: boolean
}

export interface SearchAfter {
  group?: string
  project?: string
  creator?: string
  text?: string
  size?: number
  sort?: any[]
}

export interface SearchAfterCase extends SearchAfter {
  onlyMe?: boolean
}

export interface CaseWithSort extends Case {
  _sort: any[]
}

export interface UpdateCase {
  id?: string
  cs?: Case
}
export interface BatchOperationLabels {
  labels?: { id: string, labels: LabelRef[] }[]
}

export interface BatchTransfer {
  group?: string
  project?: string
  ids?: string[]
}

export function httpRequestSignature(cs: Case) {
  if (cs && cs.request) {
    if (cs.request.port) {
      return `${cs.request.host}:${cs.request.port}${cs.request.urlPath}`
    } else {
      return `${cs.request.host}${cs.request.urlPath}`
    }
  } else {
    return ''
  }
}
