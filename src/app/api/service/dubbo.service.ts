import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { ApiRes } from 'app/model/api.model'

import { API_DUBBO } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class DubboService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  getInterfaces(msg: GetInterfacesMessage) {
    return this.http.post<ApiRes<DubboInterface[]>>(`${API_DUBBO}/interfaces`, msg)
  }

  getProviders(msg: GetProvidersMessage) {
    return this.http.post<ApiRes<DubboProvider[]>>(`${API_DUBBO}/providers`, msg)
  }
}

export interface GetInterfacesMessage {
  zkAddr?: string
  path?: string
}

export interface GetProvidersMessage {
  zkAddr?: string
  path?: string
  ref?: string
}

export interface DubboInterface {
  zkAddr?: string
  path?: string
  ref?: string
}

export interface DubboProvider {
  zkAddr?: string
  path?: string
  ref?: string
  address?: string
  port?: string
  methods?: string[]
}
