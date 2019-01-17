import { Inject, Injectable } from '@angular/core'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth'
import { _HttpClient } from '@delon/theme'
import { ApiRes } from 'app/model/api.model'
import { newWS } from 'app/util/ws'
import { NzMessageService } from 'ng-zorro-antd'

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

  getInterfaces(msg: GetInterfacesMessage) {
    return this.http.post<ApiRes<DubboInterface[]>>(`${API_DUBBO}/interfaces`, msg)
  }

  getProviders(msg: GetProvidersMessage) {
    return this.http.post<ApiRes<DubboProvider[]>>(`${API_DUBBO}/providers`, msg)
  }

  test(msg: GenericRequest) {
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

export interface GenericRequest {
  group?: string
  project?: string
  dubboGroup?: string
  interface?: string
  method?: string
  parameterTypes?: string[]
  args?: any[]
  address?: string
  port?: number
  version?: string
}
