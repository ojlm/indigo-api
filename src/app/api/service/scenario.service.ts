import { Inject, Injectable } from '@angular/core'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth'
import { _HttpClient } from '@delon/theme'
import { NzMessageService } from 'ng-zorro-antd'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, ApiResObj, QueryPage } from '../../model/api.model'
import {
  Case,
  DeleteResData,
  DubboRequest,
  IndexDocResponse,
  ReportItemEvent,
  Scenario,
  ScenarioStep,
  SqlRequest,
} from '../../model/es.model'
import { newWS } from '../../util/ws'
import { API_SCENARIO, API_SCENARIO_QUERY, API_WS_SCENARIO_TEST } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class ScenarioService extends BaseService {

  constructor(
    private http: _HttpClient,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) { super() }

  query(query: QueryScenario) {
    return this.http.post<ApiRes<Scenario[]>>(API_SCENARIO_QUERY, query)
  }

  index(scenario: Scenario) {
    return this.http.put(API_SCENARIO, scenario) as Observable<ApiRes<IndexDocResponse>>
  }

  delete(id: string, preview: boolean = null) {
    return this.http.delete(`${API_SCENARIO}/${id}${preview === null ? '' : '?preview=' + preview}`) as Observable<ApiRes<DeleteResData>>
  }

  update(id: string, scenario: Scenario) {
    return this.http.post<ApiResObj>(`${API_SCENARIO}/update/${id}`, scenario)
  }

  getById(id: string) {
    return this.http.get<ApiRes<ScenarioResponse>>(`${API_SCENARIO}/${id}`)
  }

  newQuerySubject(response: Subject<ApiRes<Scenario[]>>) {
    const querySubject = new Subject<QueryScenario>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<Scenario[]>>(API_SCENARIO_QUERY, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  newTestWs(group: string, project: string, id: string) {
    let idParam = ''
    if (id) {
      idParam = `&id=${id}`
    }
    const ws = newWS(`${API_WS_SCENARIO_TEST}/${group}/${project}?token=${this.tokenService.get()['token']}${idParam}`)
    ws.onerror = (event) => {
      console.error(event)
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorWsOnError))
    }
    return ws
  }
}

export interface QueryScenario extends QueryPage {
  group?: string
  project?: string
  text?: string
  ids?: string[]
}

export interface ScenarioResponse {
  scenario?: Scenario
  case?: { [k: string]: Case }
  dubbo?: { [k: string]: DubboRequest }
  sql?: { [k: string]: SqlRequest }
}

export const ScenarioStepType = {
  CASE: 'case',
  SQL: 'sql',
  DUBBO: 'dubbo',
}

export function caseToScenarioStep(doc: Case): ScenarioStep {
  return {
    id: doc._id,
    type: ScenarioStepType.CASE,
    stored: false,
    enabled: true,
  }
}

export function sqlRequestToScenarioStep(doc: SqlRequest): ScenarioStep {
  return {
    id: doc._id,
    type: ScenarioStepType.SQL,
    stored: false,
    enabled: true,
  }
}

export function dubboRequestToScenarioStep(doc: DubboRequest): ScenarioStep {
  return {
    id: doc._id,
    type: ScenarioStepType.DUBBO,
    stored: false,
    enabled: true,
  }
}

export function getScenarioStepCacheKey(step: ScenarioStep) {
  return `${step.type}:${step.id}`
}

export interface StepStatusData {
  report?: ReportItemEvent
  status?: string
}
