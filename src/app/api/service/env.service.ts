import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, QueryPage } from '../../model/api.model'
import { Environment } from '../../model/es.model'
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
    return this.http.put(API_ENV, env)
  }

  getById(id: string) {
    return this.http.get<ApiRes<Environment>>(`${API_ENV}/${id}`)
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
