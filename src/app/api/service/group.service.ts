import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, ApiResObj, QueryPage } from '../../model/api.model'
import { Group } from '../../model/es.model'
import { API_GROUP, API_GROUP_QUERY } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class GroupService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  query(query: QueryGroup) {
    return this.http.post<ApiRes<Group[]>>(API_GROUP_QUERY, query)
  }

  index(group: Group) {
    return this.http.put(API_GROUP, group)
  }

  update(group: Group) {
    return this.http.post<ApiResObj>(API_GROUP, group)
  }

  getById(id: string) {
    return this.http.get<ApiRes<Group>>(`${API_GROUP}/${id}`)
  }

  newQuerySubject(response: Subject<ApiRes<Group[]>>) {
    const querySubject = new Subject<QueryGroup>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<Group[]>>(API_GROUP_QUERY, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }
}

export interface QueryGroup extends QueryPage {
  id?: string
  text?: string
}
