import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, ApiResObj, QueryPage } from '../../model/api.model'
import {
  Case,
  CiTrigger,
  DeleteResData,
  DubboRequest,
  IndexDocResponse,
  Job,
  Scenario,
  SqlRequest,
  TriggerEventLog,
} from '../../model/es.model'
import { API_TRIGGER } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class TriggerService extends BaseService {

  constructor(
    private http: _HttpClient,
  ) { super() }

  query(query: QueryTrigger) {
    return this.http.post<ApiRes<CiTrigger[]>>(`${API_TRIGGER}/query`, query)
  }

  events(query: QueryCiEvents) {
    return this.http.post<ApiRes<TriggerEventLog[]>>(`${API_TRIGGER}/events`, query)
  }

  index(doc: CiTrigger) {
    return this.http.put(API_TRIGGER, doc) as Observable<ApiRes<IndexDocResponse>>
  }

  delete(id: string) {
    return this.http.delete(`${API_TRIGGER}/${id}`) as Observable<ApiRes<DeleteResData>>
  }

  update(id: string, doc: CiTrigger) {
    return this.http.post<ApiResObj>(`${API_TRIGGER}/update/${id}`, doc)
  }

  getById(id: string) {
    return this.http.get<ApiRes<TriggerResponse>>(`${API_TRIGGER}/${id}`)
  }

  newQuerySubject(response: Subject<ApiRes<CiTrigger[]>>) {
    const querySubject = new Subject<QueryTrigger>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<CiTrigger[]>>(`${API_TRIGGER}/query`, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }
}

export interface QueryTrigger extends QueryPage {
  group?: string
  project?: string
  text?: string
}

export interface QueryCiEvents extends QueryPage {
  group?: string
  project?: string
  env?: string
  type?: string
  service?: string
}

export interface TriggerResponse {
  trigger?: CiTrigger
  readiness?: Case | SqlRequest | DubboRequest | Scenario | Job
  target?: Job
}
