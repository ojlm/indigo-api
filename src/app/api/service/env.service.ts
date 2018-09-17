import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, QueryPage } from '../../model/api.model'
import { Environment, IndexDocResponse, UpdateDocResponse } from '../../model/es.model'
import { API_ENV, API_ENV_QUERY } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class EnvService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  query(query: QueryEnv) {
    return this.http.post<ApiRes<Environment[]>>(API_ENV_QUERY, query)
  }

  index(env: Environment) {
    return this.http.put(`${API_ENV}/${env.group}/${env.project}`, env) as Observable<ApiRes<IndexDocResponse>>
  }

  getById(id: string) {
    return this.http.get<ApiRes<Environment>>(`${API_ENV}/${id}`)
  }

  update(id: string, env: Environment) {
    return this.http.post<ApiRes<UpdateDocResponse>>(`${API_ENV}/${env.group}/${env.project}/${id}`, env)
  }

  newQuerySubject(response: Subject<ApiRes<Environment[]>>) {
    const querySubject = new Subject<QueryEnv>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<Environment[]>>(API_ENV_QUERY, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }
}

export interface QueryEnv extends QueryPage {
  group?: string
  project?: string
  text?: string
}
