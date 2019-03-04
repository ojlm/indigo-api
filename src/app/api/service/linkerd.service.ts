import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'

import { ApiRes } from '../../model/api.model'
import { API_LINKERD_V1_DTABS_HTTP } from '../path'

@Injectable({
  providedIn: 'root'
})
export class LinkerdService {

  constructor(private http: _HttpClient) { }

  getProxyServers() {
    return this.http.get<ApiRes<LinkerdConfigServer[]>>(`${API_LINKERD_V1_DTABS_HTTP}/servers`)
  }

  getV1Http(group: string, project: string, server: string) {
    return this.http.get<ApiRes<DtabItem[]>>(`${API_LINKERD_V1_DTABS_HTTP}/${group}/${project}/${server}`)
  }

  putV1Http(group: string, project: string, dtabs: DtabItem[], server: string) {
    return this.http.put<ApiRes<string>>(`${API_LINKERD_V1_DTABS_HTTP}/${group}/${project}/${server}`, { dtabs })
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

export interface LinkerdConfigServer {
  tag?: string
  description?: string
  namerd?: string
  proxyHost?: string
  httpProxyPort?: number
  httpsProxyPort?: number
  headerIdentifier?: string
  httpNs?: string
}
