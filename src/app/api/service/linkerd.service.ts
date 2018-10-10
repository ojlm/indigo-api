import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'

import { ApiRes } from '../../model/api.model'
import { API_LINKERD_V1_DTABS_HTTP } from '../path'

@Injectable({
  providedIn: 'root'
})
export class LinkerdService {

  constructor(private http: _HttpClient) { }

  getV1Http(group: string, project: string) {
    return this.http.get<ApiRes<DtabItem[]>>(`${API_LINKERD_V1_DTABS_HTTP}/${group}/${project}`)
  }

  putV1Http(group: string, project: string, dtabs: DtabItem[]) {
    return this.http.put<ApiRes<string>>(`${API_LINKERD_V1_DTABS_HTTP}/${group}/${project}`, dtabs)
  }
}

export interface DtabItem {
  group?: string
  project?: string
  namespace?: string
  host?: string
  port?: string
  owned?: string
}
