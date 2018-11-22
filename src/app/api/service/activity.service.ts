import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'

import { ApiRes } from '../../model/api.model'
import { API_ACTIVITY } from '../path'
import { AggsQuery, BaseService, TrendResponse } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class ActivityService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  trend(aggs: AggsQuery) {
    return this.http.post<ApiRes<TrendResponse>>(`${API_ACTIVITY}/aggs/trend`, aggs)
  }
}
