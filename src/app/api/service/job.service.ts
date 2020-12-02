import { Inject, Injectable } from '@angular/core'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth'
import { _HttpClient } from '@delon/theme'
import { NzMessageService } from 'ng-zorro-antd'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, QueryPage } from '../../model/api.model'
import {
  IndexDocResponse,
  Job,
  JobNotify,
  JobReport,
  JobReportDataItem,
  ScenarioStep,
  VariablesImportItem,
} from '../../model/es.model'
import { JobData, JobMeta, TriggerMeta } from '../../model/job.model'
import { newWS } from '../../util/ws'
import { API_JOB, API_WS } from '../path'
import { AggsItem, AggsQuery, BaseService, TrendResponse } from './base.service'
import { ScenarioStepType } from './scenario.service'

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

  checkCron(group: string, project: string, cron: String) {
    return this.http.post(`${API_JOB}/${group}/${project}/cron`, cron) as Observable<ApiRes<string[]>>
  }

  index(job: NewJob) {
    return this.http.put(`${API_JOB}/${job.jobMeta.group}/${job.jobMeta.project}`, job) as Observable<ApiRes<IndexDocResponse>>
  }

  update(id: string, job: NewJob) {
    return this.http.post(`${API_JOB}/${job.jobMeta.group}/${job.jobMeta.project}`, { id, ...job })
  }

  resume(op: JobOperation) {
    return this.http.post<ApiRes<Job[]>>(`${API_JOB}/${op.group}/${op.project}/resume`, op)
  }

  pause(op: JobOperation) {
    return this.http.post<ApiRes<Job[]>>(`${API_JOB}/${op.group}/${op.project}/pause`, op)
  }

  delete(op: JobOperation) {
    return this.http.post<ApiRes<Job[]>>(`${API_JOB}/${op.group}/${op.project}/delete`, op)
  }

  query(query: QueryJob) {
    return this.http.post<ApiRes<Job[]>>(`${API_JOB}/${query.group}/${query.project}/query`, query)
  }

  getReportById(group: string, project: string, id: string) {
    return this.http.get<ApiRes<JobReport>>(`${API_JOB}/${group}/${project}/report/${id}`)
  }

  jobTrend(group: string, project: string, id: string) {
    return this.http.get<ApiRes<JobReport[]>>(`${API_JOB}/${group}/${project}/report/trend/${id}`)
  }

  trend(aggs: AggsQuery) {
    return this.http.post<ApiRes<TrendResponse>>(`${API_JOB}/${aggs.group}/${aggs.project}/report/trend`, aggs)
  }

  getReportItemById(group: string, project: string, day: string, id: string) {
    return this.http.get<ApiRes<JobReportDataItem>>(`${API_JOB}/${group}/${project}/report/item/${day}/${id}`)
  }

  queryReports(query: QueryJobReport) {
    return this.http.post<ApiRes<JobReport[]>>(`${API_JOB}/${query.group}/${query.project}/reports`, query)
  }

  getById(group: string, project: string, id: string) {
    return this.http.get<ApiRes<Job>>(`${API_JOB}/${group}/${project}/${id}`)
  }

  copyById(group: string, project: string, id: string) {
    return this.http.get<ApiRes<IndexDocResponse>>(`${API_JOB}/${group}/${project}/copy/${id}`)
  }

  aggsLabelsSubject(group: string, project: string, response: Subject<ApiRes<AggsItem[]>>) {
    const querySubject = new Subject<string>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(label => {
      this.http.get<ApiRes<AggsItem[]>>(`${API_JOB}/${group}/${project}/aggs/labels?label=${label}`).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  newQuerySubject(response: Subject<ApiRes<Job[]>>) {
    const querySubject = new Subject<QueryJob>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<Job[]>>(`${API_JOB}/${query.group}/${query.project}/query`, query).subscribe(
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
    const ws = newWS(`${API_WS}/job/${group}/${project}/test?token=${this.tokenService.get()['token']}${idParam}`)
    ws.onerror = (event) => {
      console.error(event)
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorWsOnError))
    }
    return ws
  }

  getAllNotifiers(group: string, project: string) {
    return this.http.get<ApiRes<JobNotifyFunction[]>>(`${API_JOB}/${group}/${project}/notify`)
  }

  newSubscriber(subscriber: JobNotify) {
    return this.http.put<ApiRes<IndexDocResponse>>(`${API_JOB}/${subscriber.group}/${subscriber.project}/notify`, subscriber)
  }

  updateSubscriber(id: string, subscriber: JobNotify) {
    return this.http.post<ApiRes<IndexDocResponse>>(`${API_JOB}/${subscriber.group}/${subscriber.project}/notify/${id}`, subscriber)
  }

  querySubscribers(query: QueryJobNotify) {
    return this.http.post<ApiRes<JobNotify[]>>(`${API_JOB}/${query.group}/${query.project}/notify`, query)
  }

  deleteSubscriber(group: string, project: string, id: string) {
    return this.http.delete(`${API_JOB}/${group}/${project}/notify/${id}`)
  }

  getJobState(group: string, project: string, items: QueryJobStateItem[]) {
    return this.http.post<ApiRes<Object>>(`${API_JOB}/${group}/${project}/state`, { items: items })
  }
}

export function isJobScenarioStep(step: ScenarioStep) {
  if ((null != step && !step.type && step.id) || (ScenarioStepType.SCENARIO === step.type && step.id)) {
    return true
  } else {
    return false
  }
}

export interface QueryJob extends QueryPage {
  group?: string
  project?: string
  text?: string
  triggerType?: string
}

export interface NewJob {
  jobMeta?: JobMeta
  triggerMeta?: TriggerMeta
  jobData?: JobData
  notifies?: JobNotify[]
  imports?: VariablesImportItem[]
}

export interface QueryJobNotify extends QueryPage {
  group?: string
  project?: string
  jobId?: string
  subscriber?: string
  type?: string
  trigger?: string
  enabled?: boolean
}

export interface JobNotifyFunction {
  type?: string
  description?: string
}

export interface JobOperation {
  group?: string
  project?: string
  id?: string
}

export interface QueryJobStateItem {
  group?: string
  project?: string
  jobId?: string
}

export interface QueryJobReport {
  scheduler?: string
  group?: string
  project?: string
  text?: string
  classAlias?: string
  type?: string
  jobId?: string
  result?: string
  timeStart?: string
  timeEnd?: string
  from?: number
  size?: number
}
