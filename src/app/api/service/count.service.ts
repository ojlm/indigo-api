import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'

import { ApiRes } from '../../model/api.model'
import { COUNT_API } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class CountService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  all() {
    return this.http.get<ApiRes<AllCountResponse>>(`${COUNT_API}/all`)
  }
}

export interface AllCountResponse {
  'http': number
  'dubbo': number
  'sql': number
  'scenario': number
  'job': number
  'webHttp': number
  'webDubbo': number
  'webSql': number
  'webScenario': number
  'webJob': number
  'ciJob': number
  'quartzJob': number
}
