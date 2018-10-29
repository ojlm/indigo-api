import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { Observable } from 'rxjs'

import { ApiRes } from '../../model/api.model'
import { API_SYSTEM } from '../path'

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(private http: _HttpClient) { }

  getJobReportDataIndices() {
    return this.http.get<ApiRes<CatIndicesResponse[]>>(`${API_SYSTEM}/job-report-indices`)
  }

  deleteJobReportDataIndex(index: string) {
    return this.http.delete(`${API_SYSTEM}/job-report-indices/${index}`) as Observable<ApiRes<any>>
  }
}

export interface CatIndicesResponse {
  health?: string
  status?: string
  index?: string
  uuid?: string
  pri?: string
  rep?: string
  'docs.count'?: string
  'docs.deleted'?: string
  'store.size'?: string
  'pri.store.size'?: string
}
