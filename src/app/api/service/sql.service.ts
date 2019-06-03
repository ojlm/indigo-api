import { Inject, Injectable } from '@angular/core'
import { I18NService } from '@core/i18n/i18n.service'
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth'
import { _HttpClient } from '@delon/theme'
import { ApiRes, QueryPage } from 'app/model/api.model'
import { ContextOptions, IndexDocResponse, SqlRequest, UpdateDocResponse } from 'app/model/es.model'
import { AbstractResult } from 'app/model/job.model'
import { NzMessageService } from 'ng-zorro-antd'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { API_SQL } from '../path'
import { AggsItem, BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class SqlService extends BaseService {

  constructor(
    private http: _HttpClient,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) { super() }

  query(query: QuerySqlRequest) {
    return this.http.post<ApiRes<SqlRequest[]>>(`${API_SQL}/query`, query)
  }

  index(doc: SqlRequest) {
    return this.http.put(API_SQL, doc) as Observable<ApiRes<IndexDocResponse>>
  }

  delete(id: string) {
    return this.http.delete(`${API_SQL}/${id}`) as Observable<ApiRes<any>>
  }

  update(id: string, doc: SqlRequest) {
    return this.http.post<ApiRes<UpdateDocResponse>>(`${API_SQL}/update/${id}`, doc)
  }

  getById(id: string) {
    return this.http.get<ApiRes<SqlRequest>>(`${API_SQL}/${id}`)
  }

  test(msg: { id: string, request: SqlRequest, options: ContextOptions }) {
    return this.http.post<ApiRes<SqlResult>>(`${API_SQL}/test`, msg)
  }

  newQuerySubject(response: Subject<ApiRes<SqlRequest[]>>) {
    const querySubject = new Subject<QuerySqlRequest>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<SqlRequest[]>>(`${API_SQL}/query`, query).subscribe(
        res => response.next(res),
        err => response.next(null))
    })
    return querySubject
  }

  aggsLabelsSubject(response: Subject<ApiRes<AggsItem[]>>) {
    const querySubject = new Subject<string>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(label => {
      this.http.get<ApiRes<AggsItem[]>>(`${API_SQL}/aggs/labels?label=${label}`).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }
}

export function sqlRequestSignature(item: SqlRequest) {
  if (item && item.request) {
    return `${item.request.host}:${item.request.port}/${item.request.database}/${item.request.table}`
  } else {
    return ''
  }
}

export interface QuerySqlRequest extends QueryPage {
  group?: string
  project?: string
  text?: string
  host?: string
  database?: string
  table?: string
  sql?: string
  hasCreators?: boolean
}

export interface SqlRequestReportModel {
  host?: string
  port?: number
  username?: string
  database?: string
  table?: string
  sql?: string
}

export interface SqlResponseReportModel {
  body?: object
}

export interface SqlResult extends AbstractResult {
  request?: SqlRequestReportModel
  response?: SqlResponseReportModel
}
