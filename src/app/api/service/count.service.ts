import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'

import { ApiRes } from '../../model/api.model'
import { API_COUNT } from '../path'
import { AggsItem, BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class CountService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  all() {
    return this.http.get<ApiRes<AllResponse>>(`${API_COUNT}/all`)
  }
}

export interface AllResponse {
  count: AllCountResponse
  histogram: AllHistogramResponse
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

export interface AllHistogramResponse {
  'http': AggsItem[]
  'dubbo': AggsItem[]
  'sql': AggsItem[]
  'scenario': AggsItem[]
  'job': AggsItem[]
  'webHttp': AggsItem[]
  'webDubbo': AggsItem[]
  'webSql': AggsItem[]
  'webScenario': AggsItem[]
  'webJob': AggsItem[]
  'ciJob': AggsItem[]
  'quartzJob': AggsItem[]
}
