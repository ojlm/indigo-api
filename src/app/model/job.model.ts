import { CaseReportItemMetrics, CaseStatis, Job, LabelRef, ScenarioStep } from './es.model'

export interface JobMeta {
  group?: string
  project?: string
  summary?: string
  description?: string
  comment?: string
  scheduler?: string
  env?: string
  labels?: LabelRef[]
  classAlias?: string
}

export interface TriggerMeta {
  group?: string
  project?: string
  cron?: string
  triggerType?: string
  startNow?: boolean
  startDate?: number
  endDate?: number
  repeatCount?: number
  interval?: number
}

export interface DocRef {
  id?: string
}

export interface JobDataExt {
  path?: string
  methods?: string[]
  text?: string
  labels?: string[]
}

export interface JobData {
  cs?: DocRef[]
  scenario?: ScenarioStep[]
  ext?: JobDataExt
}

export interface JobListItem extends Job {
  state?: string
}

export interface JobExecLog {
  id: number
  elapse: number
  errorMsg: string
  jobGroup: string
  jobName: string
  schedName: string
  startAt: string
  endAt: string
  status: number
}

export const TriggerType = {
  MANUAL: 'manual',
  SIMPLE: 'simple',
  CRON: 'cron',
  API: 'api',
}

export interface AbstractResult {
  docId?: string
  assert?: any
  context?: any
  request?: any
  response?: any
  metrics?: CaseReportItemMetrics
  statis?: CaseStatis
  result?: object
  generator?: string
  renderedExportDesc?: { [k: number]: string }
}
