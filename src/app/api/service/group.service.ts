import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'

import { ApiRes, QueryPage } from '../../model/api.model'
import { Group } from '../../model/es.model'
import { API_GROUP, API_GROUP_QUERY } from '../path'

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: _HttpClient) { }

  query(query: QueryGroup) {
    return this.http.post<ApiRes<Group[]>>(API_GROUP_QUERY, query)
  }

  index(group: Group) {
    return this.http.put(API_GROUP, group)
  }
}

export interface QueryGroup extends QueryPage {
  text?: string
}
