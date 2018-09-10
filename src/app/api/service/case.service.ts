import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, QueryPage } from '../../model/api.model'
import { Case, CaseResult, IndexDocResponse, UpdateDocResponse } from '../../model/es.model'
import { API_CASE, API_CASE_QUERY, API_CASE_TEST, API_CASE_UPDATE } from '../path'
import { BaseService } from './base.service'

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

  update(id: string, cs: Case) {
    return this.http.post<ApiRes<UpdateDocResponse>>(`${API_CASE_UPDATE}/${id}`, cs)
  }

  test(cs: Case) {
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
        err => response.error(err))
    })
    return querySubject
  }
}

export interface QueryCase extends QueryPage {
  group?: string
  project?: string
  method?: string
  path?: string
  text?: string
}
