import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, QueryPage } from '../../model/api.model'
import { UserProfile } from '../../model/user.model'
import { API_USER } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  get() {
    return this.http.get<ApiRes<UserProfile>>(API_USER)
  }

  update(profile: UserProfile) {
    return this.http.post<UserProfile>(API_USER, profile)
  }

  newQuerySubject(response: Subject<ApiRes<UserProfile[]>>) {
    const querySubject = new Subject<QueryUser>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<UserProfile[]>>(`${API_USER}/query`, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  getUserLabel(user: UserProfile) {
    return user.nickname || user.username
  }

  getAvatarText(user: UserProfile) {
    if (user.avatar) {
      return user.avatar
    } else if (user.nickname) {
      return user.nickname[0]
    } else {
      return user.username[0]
    }
  }
}

export interface QueryUser extends QueryPage {
  text?: string
}
