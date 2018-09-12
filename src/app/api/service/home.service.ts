import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes } from '../../model/api.model'
import { API_HOME } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class HomeService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  newQuerySubject(response: Subject<ApiRes<HomeDoc[]>>) {
    const querySubject = new Subject<QueryHome>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<HomeDoc[]>>(API_HOME, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }
}

export interface QueryHome {
  text?: string
}

export interface HomeDoc {
  _type?: string
  _id?: string
  group?: string
  project?: string
  avatar?: string
  summary?: string
  description?: string
}
