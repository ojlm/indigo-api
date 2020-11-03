import { Inject, Injectable } from '@angular/core'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth'
import { _HttpClient } from '@delon/theme'
import { ApiRes, QueryPage } from 'app/model/api.model'
import { ContextOptions, DeleteResData, DubboRequest, IndexDocResponse, UpdateDocResponse } from 'app/model/es.model'
import { AbstractResult } from 'app/model/job.model'
import { newWS } from 'app/util/ws'
import { NzMessageService } from 'ng-zorro-antd'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { API_DUBBO, API_WS_DUBBO } from '../path'
import { AggsItem, BaseService } from './base.service'

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
    return this.http.post<ApiRes<DubboRequest[]>>(`${API_DUBBO}/${query.group}/${query.project}/query`, query)
  }

  index(doc: DubboRequest) {
    return this.http.put(`${API_DUBBO}/${doc.group}/${doc.project}`, doc) as Observable<ApiRes<IndexDocResponse>>
  }

  clone(group: string, project: string, id: string) {
    return this.http.put(`${API_DUBBO}/${group}/${project}/clone/${id}`) as Observable<ApiRes<IndexDocResponse>>
  }

  delete(group: string, project: string, id: string, preview: boolean = null) {
    return this.http.delete(
      `${API_DUBBO}/${group}/${project}/${id}${preview === null ? '' : '?preview=' + preview}`) as Observable<ApiRes<DeleteResData>>
  }

  update(id: string, doc: DubboRequest) {
    return this.http.post<ApiRes<UpdateDocResponse>>(`${API_DUBBO}/${doc.group}/${doc.project}/update/${id}`, doc)
  }

  getById(group: string, project: string, id: string) {
    return this.http.get<ApiRes<DubboRequest>>(`${API_DUBBO}/${group}/${project}/${id}`)
  }

  getInterfaces(group: string, project: string, msg: GetInterfacesMessage) {
    return this.http.post<ApiRes<DubboInterface[]>>(`${API_DUBBO}/${group}/${project}/interfaces`, msg)
  }

  getProviders(group: string, project: string, msg: GetProvidersMessage) {
    return this.http.post<ApiRes<DubboProvider[]>>(`${API_DUBBO}/${group}/${project}/providers`, msg)
  }

  getParams(group: string, project: string, msg: GetInterfaceMethodParams) {
    return this.http.post<ApiRes<InterfaceMethodParams>>(`${API_DUBBO}/${group}/${project}/params`, msg)
  }

  test(group: string, project: string, msg: { id: string, request: DubboRequest, options: ContextOptions }) {
    return this.http.post<ApiRes<DubboResult>>(`${API_DUBBO}/${group}/${project}/test`, msg)
  }

  newTelnetWs(address: string, port: number = 0) {
    const ws = newWS(`${API_WS_DUBBO}/telnet/${address}/${port}?token=${this.tokenService.get()['token']}`)
    ws.onerror = (event) => {
      console.error(event)
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorWsOnError))
    }
    return ws
  }

  newQuerySubject(response: Subject<ApiRes<QueryDubboRequest[]>>) {
    const querySubject = new Subject<DubboRequest>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<DubboRequest[]>>(`${API_DUBBO}/${query.group}/${query.project}/query`, query).subscribe(
        res => response.next(res),
        err => response.next(null))
    })
    return querySubject
  }

  aggsLabelsSubject(group: string, project: string, response: Subject<ApiRes<AggsItem[]>>) {
    const querySubject = new Subject<string>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(label => {
      this.http.get<ApiRes<AggsItem[]>>(`${API_DUBBO}/${group}/${project}/aggs/labels?label=${label}`).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }
}

export function dubboRequestSignature(item: DubboRequest) {
  if (item && item.request) {
    let parameterTypes = ''
    if (item.request.parameterTypes) {
      parameterTypes = item.request.parameterTypes.map(p => p.type).join(', ')
    }
    return `${item.request.interface}.${item.request.method}(${parameterTypes})`
  } else {
    return ''
  }
}

export interface GetInterfacesMessage {
  zkConnectString?: string
  path?: string
  zkUsername?: string
  zkPassword?: string
}

export interface GetProvidersMessage {
  zkConnectString?: string
  path?: string
  ref?: string
  zkUsername?: string
  zkPassword?: string
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
  zkConnectString?: string
  path?: string
  ref?: string
}

export interface DubboProvider {
  zkConnectString?: string
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
  isCloned?: boolean
}

export interface DubboResponseReportModel {
  body?: object
}

export interface DubboResult extends AbstractResult {
  request?: GenericRequest
  response?: DubboResponseReportModel
}
