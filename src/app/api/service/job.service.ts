import { Inject, Injectable } from '@angular/core'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth'
import { _HttpClient } from '@delon/theme'
import { NzMessageService } from 'ng-zorro-antd'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, QueryPage } from '../../model/api.model'
import { IndexDocResponse, Job } from '../../model/es.model'
import { JobData, JobMeta, TriggerMeta } from '../../model/job.model'
import { newWS } from '../../util/ws'
import { API_JOB, API_JOB_CRON, API_JOB_QUERY, API_WS_JOB_TEST } from '../path'
import { BaseService } from './base.service'


@Injectable({
  providedIn: 'root'
})
export class JobService extends BaseService {

  constructor(
    private http: _HttpClient,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) { super() }

  checkCron(cron: String) {
    return this.http.post(API_JOB_CRON, cron) as Observable<ApiRes<string[]>>
  }

  index(job: NewJob) {
    return this.http.put(API_JOB, job) as Observable<ApiRes<IndexDocResponse>>
  }

  update(id: string, job: NewJob) {
    return this.http.post(API_JOB, { id, ...job })
  }

  query(query: QueryJob) {
    return this.http.post<ApiRes<Job[]>>(API_JOB_QUERY, query)
  }

  getById(id: string) {
    return this.http.get<ApiRes<Job>>(`${API_JOB}/${id}`)
  }

  newQuerySubject(response: Subject<ApiRes<Job[]>>) {
    const querySubject = new Subject<QueryJob>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<Job[]>>(API_JOB_QUERY, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  newTestWs() {
    const ws = newWS(`${API_WS_JOB_TEST}?token=${this.tokenService.get()['token']}`)
    ws.onerror = (event) => {
      console.error(event)
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorWsOnError))
    }
    return ws
  }
}

export interface QueryJob extends QueryPage {
  group?: string
  project?: string
  text?: string
}

export interface NewJob {
  jobMeta?: JobMeta
  triggerMeta?: TriggerMeta
  jobData?: JobData
}
