import { Injectable } from '@angular/core'
import { I18NService } from '@core'
import { _HttpClient } from '@delon/theme'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, ApiResObj, QueryPage } from '../../model/api.model'
import { IndexDocResponse, Permissions } from '../../model/es.model'
import { API_PERMISSIONS } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class PermissionsService extends BaseService {

  PermissionRoles = {
    owner: 'owner',
    maintainer: 'maintainer',
    developer: 'developer',
    reporter: 'reporter',
    guest: 'guest'
  }

  constructor(
    private http: _HttpClient,
    private i18nService: I18NService,
  ) { super() }

  BASIC_ROLES = [
    { name: this.i18nService.fanyi(`permission-${this.PermissionRoles.guest}`), value: this.PermissionRoles.guest },
    { name: this.i18nService.fanyi(`permission-${this.PermissionRoles.reporter}`), value: this.PermissionRoles.reporter },
    { name: this.i18nService.fanyi(`permission-${this.PermissionRoles.developer}`), value: this.PermissionRoles.developer },
    { name: this.i18nService.fanyi(`permission-${this.PermissionRoles.maintainer}`), value: this.PermissionRoles.maintainer },
  ]
  OWER_ROLE = { name: this.i18nService.fanyi(`permission-${this.PermissionRoles.owner}`), value: this.PermissionRoles.owner }
  getRoleOptions(currentRole: string) {
    if (currentRole === this.PermissionRoles.owner) {
      return [...this.BASIC_ROLES, this.OWER_ROLE]
    } else {
      return this.BASIC_ROLES
    }
  }

  getRoleText(role: string) {
    return this.i18nService.fanyi(`permission-${role}`)
  }

  indexGroup(group: string, doc: Permissions) {
    return this.http.put<ApiRes<IndexDocResponse>>(`${API_PERMISSIONS}/group/${group}`, doc)
  }

  deleteGroup(group: string, id: string) {
    return this.http.delete(`${API_PERMISSIONS}/group/${group}/${id}`) as Observable<ApiRes<any>>
  }

  updateGroup(group: string, id: string, doc: Permissions) {
    return this.http.post<ApiResObj>(`${API_PERMISSIONS}/group/${group}/update/${id}`, doc)
  }

  newQueryGroupSubject(group: string, response: Subject<ApiRes<Permissions[]>>) {
    const querySubject = new Subject<QueryPermissions>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<Permissions[]>>(`${API_PERMISSIONS}/group/${group}/query`, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  indexProject(group: string, project: string, doc: Permissions) {
    return this.http.put<ApiRes<IndexDocResponse>>(`${API_PERMISSIONS}/project/${group}/${project}`, doc)
  }

  deleteProject(group: string, project: string, id: string) {
    return this.http.delete(`${API_PERMISSIONS}/project/${group}/${project}/${id}`) as Observable<ApiRes<any>>
  }

  updateProject(group: string, project: string, id: string, doc: Permissions) {
    return this.http.post<ApiResObj>(`${API_PERMISSIONS}/project/${group}/${project}/update/${id}`, doc)
  }

  newQueryProjectSubject(group: string, project: string, response: Subject<ApiRes<Permissions[]>>) {
    const querySubject = new Subject<QueryPermissions>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<Permissions[]>>(`${API_PERMISSIONS}/project/${group}/${project}/query`, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }
}

export interface QueryPermissions extends QueryPage {
  group?: string
  project?: string
  username?: string
  type?: string
}
