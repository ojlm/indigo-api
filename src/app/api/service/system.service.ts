import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'

import { ApiRes } from '../../model/api.model'
import { API_SYSTEM } from '../path'

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(private http: _HttpClient) { }

  getJobDataIndices() {
    return this.http.get<ApiRes<CatIndicesResponse[]>>(`${API_SYSTEM}/job-report-indices`)
  }
}

export interface CatIndicesResponse {
  health?: string
  status?: string
  index?: string
  uuid?: string
  pri?: string
  ref?: string
  count?: string
  deleted?: string
  storeSize?: string
  priStoreSize?: string
}
