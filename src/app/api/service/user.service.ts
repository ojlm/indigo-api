import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'

import { ApiRes } from '../../model/api.model'
import { UserProfile } from '../../model/user.model'
import { API_USER } from '../path'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: _HttpClient) { }

  get() {
    return this.http.get<ApiRes<UserProfile>>(API_USER)
  }

  update(profile: UserProfile) {
    return this.http.post<UserProfile>(API_USER, profile)
  }

}
