import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, ApiResObj, QueryPage } from '../../model/api.model'
import { Group, IndexDocResponse, Project } from '../../model/es.model'
import { API_GROUP, API_GROUP_QUERY } from '../path'
import { BaseService } from './base.service'
import { QueryJob } from './job.service'
import { QueryProject } from './project.service'

@Injectable({
  providedIn: 'root'
})
export class GroupService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  query(query: QueryGroup) {
    return this.http.post<ApiRes<Group[]>>(API_GROUP_QUERY, query)
  }

  index(group: Group) {
    return this.http.put<ApiRes<IndexDocResponse>>(API_GROUP, group)
  }

  delete(id: string) {
    return this.http.delete(`${API_GROUP}/${id}`) as Observable<ApiRes<any>>
  }

  update(id: string, group: Group) {
    return this.http.post<ApiResObj>(`${API_GROUP}/${id}/update`, group)
  }

  projects(id: string, query: QueryProject) {
    return this.http.post<ApiRes<Project[]>>(`${API_GROUP}/${id}/projects`, query)
  }

  jobs(id: string, query: QueryJob) {
    return this.http.post<ApiRes<Project[]>>(`${API_GROUP}/${id}/jobs`, query)
  }

  getById(id: string) {
    return this.http.get<ApiRes<Group>>(`${API_GROUP}/${id}`)
  }

  getBreadcrumb(group: Group) {
    return group.summary || group.id
  }

  getAvatarText(group: Group) {
    if (group.summary) {
      return group.summary[0].toUpperCase()
    } else {
      return group.id ? group.id[0].toUpperCase() : ''
    }
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
