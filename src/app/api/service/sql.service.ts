import { Inject, Injectable } from '@angular/core'
import { I18NService } from '@core/i18n/i18n.service'
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth'
import { _HttpClient } from '@delon/theme'
import { ApiRes, QueryPage } from 'app/model/api.model'
import { CaseStatis, IndexDocResponse, SqlRequest, UpdateDocResponse } from 'app/model/es.model'
import { NzMessageService } from 'ng-zorro-antd'
import { Observable } from 'rxjs'

import { API_SQL } from '../path'
import { BaseService } from './base.service'

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

  test(msg: { id: string, request: SqlRequest }) {
    return this.http.post<ApiRes<SqlResult>>(`${API_SQL}/test`, msg)
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

export interface SqlResult {
  context?: object
  statis?: CaseStatis
  result?: object
}
