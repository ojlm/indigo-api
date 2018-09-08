import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, ApiResObj, QueryPage } from '../../model/api.model'
import { Project, UpdateDocResponse } from '../../model/es.model'
import { API_OPENAPI, API_PROJECT, API_PROJECT_QUERY } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  query(query: QueryProject) {
    return this.http.post<ApiRes<Project[]>>(API_PROJECT_QUERY, query)
  }

  index(project: Project) {
    return this.http.put(API_PROJECT, project)
  }

  update(project: Project) {
    return this.http.post<ApiResObj>(API_PROJECT, project)
  }

  getById(group: string, id: string) {
    return this.http.get<ApiRes<Project>>(`${API_PROJECT}/${group}/${id}`)
  }

  getOpenApi(group: string, id: string) {
    return this.http.get<ApiRes<Project>>(`${API_OPENAPI}/${group}/${id}`)
  }

  updateOpenApi(group: string, id: string, openapi: string) {
    return this.http.post<ApiRes<UpdateDocResponse>>(`${API_OPENAPI}/${group}/${id}`, openapi)
  }

  newQuerySubject(response: Subject<ApiRes<Project[]>>) {
    const querySubject = new Subject<QueryProject>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<Project[]>>(API_PROJECT_QUERY, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  newUpdateOpenapiSubject(response: Subject<ApiRes<UpdateDocResponse>>) {
    const updateSubject = new Subject<Project>()
    updateSubject.pipe(debounceTime(2000)).subscribe(update => {
      this.updateOpenApi(update.group, update.id, update.openapi).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return updateSubject
  }
}

export interface QueryProject extends QueryPage {
  id?: string
  text?: string
  group?: string
}