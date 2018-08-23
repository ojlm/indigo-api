import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, QueryPage } from '../../model/api.model'
import { Api } from '../../model/es.model'
import { API_API, API_API_GET_ONE, API_API_QUERY } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class ApiService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  query(query: QueryApi) {
    return this.http.post<ApiRes<Api[]>>(API_API_QUERY, query)
  }

  index(api: Api) {
    return this.http.put(API_API, api)
  }

  getOne(query: QueryApi) {
    return this.http.post<ApiRes<Api>>(`${API_API_GET_ONE}`)
  }

  newQuerySubject(response: Subject<ApiRes<Api[]>>) {
    const querySubject = new Subject<QueryApi>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<Api[]>>(API_API_QUERY, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }
}

export interface QueryApi extends QueryPage {
  text?: string
  group?: string
  project?: string
  method?: string
  path?: string
}
