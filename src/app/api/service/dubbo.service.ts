import { Inject, Injectable } from '@angular/core'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth'
import { _HttpClient } from '@delon/theme'
import { ApiRes, QueryPage } from 'app/model/api.model'
import { DubboRequest, IndexDocResponse, UpdateDocResponse } from 'app/model/es.model'
import { newWS } from 'app/util/ws'
import { NzMessageService } from 'ng-zorro-antd'
import { Observable } from 'rxjs'

import { API_DUBBO, API_WS_DUBBO } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class DubboService extends BaseService {

  constructor(
    private http: _HttpClient,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) { super() }

  query(query: QueryDubboRequest) {
    return this.http.post<ApiRes<DubboRequest[]>>(`${API_DUBBO}/query`, query)
  }

  index(doc: DubboRequest) {
    return this.http.put(API_DUBBO, doc) as Observable<ApiRes<IndexDocResponse>>
  }

  delete(id: string) {
    return this.http.delete(`${API_DUBBO}/${id}`) as Observable<ApiRes<any>>
  }

  update(id: string, doc: DubboRequest) {
    return this.http.post<ApiRes<UpdateDocResponse>>(`${API_DUBBO}/update/${id}`, doc)
  }

  getById(id: string) {
    return this.http.get<ApiRes<DubboRequest>>(`${API_DUBBO}/${id}`)
  }

  getInterfaces(msg: GetInterfacesMessage) {
    return this.http.post<ApiRes<DubboInterface[]>>(`${API_DUBBO}/interfaces`, msg)
  }

  getProviders(msg: GetProvidersMessage) {
    return this.http.post<ApiRes<DubboProvider[]>>(`${API_DUBBO}/providers`, msg)
  }

  getParams(msg: GetInterfaceMethodParams) {
    return this.http.post<ApiRes<InterfaceMethodParams>>(`${API_DUBBO}/params`, msg)
  }

  test(msg: { id: string, request: DubboRequest }) {
    return this.http.post<ApiRes<any>>(`${API_DUBBO}/test`, msg)
  }

  newTelnetWs(address: string, port: number = 0) {
    const ws = newWS(`${API_WS_DUBBO}/telnet/${address}/${port}?token=${this.tokenService.get()['token']}`)
    ws.onerror = (event) => {
      console.error(event)
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorWsOnError))
    }
    return ws
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

export interface GetInterfaceMethodParams {
  address?: string
  port?: number
  ref?: string
}

export interface MethodSignature {
  ret?: string
  method?: string
  params?: string[]
}

export interface InterfaceMethodParams {
  ref?: string
  methods?: MethodSignature[]
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
  port?: number
  methods?: string[]
}

export interface ParameterType {
  type?: string
}

export interface ArgumentList {
  args?: any[]
}

export interface GenericRequest {
  dubboGroup?: string
  interface?: string
  method?: string
  parameterTypes?: ParameterType[]
  args?: ArgumentList
  address?: string
  port?: number
  version?: string
}

export interface QueryDubboRequest extends QueryPage {
  group?: string
  project?: string
  text?: string
  interface?: string
}
